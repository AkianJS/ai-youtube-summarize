import { ResumeI, SummaryI } from "@/interface/resume.interface";
import { getYouTubeTranscript } from "@/utils/youtube-api";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: ResumeI = await req.json();
    const { url, language } = body;

    const transcriptedVideo = await getYouTubeTranscript(url);

    const transcriptionIntoChunks = splitMessageIntoChunks(
      JSON.stringify(transcriptedVideo),
      10000,
      10500
    );

    let summary: SummaryI[] = [];

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    for (const chunk of transcriptionIntoChunks) {
      const { object } = await generateObject({
        model: groq("llama-3.1-70b-versatile"),
        schema: z.object({
          text: z.string().describe("The transcription text to be summarized."),
          from: z
            .string()
            .describe("The starting point of the part to be summarized."),
          to: z
            .string()
            .describe("The ending point of the part to be summarized."),
        }),
        system: `You are a professional summarizer, concise and clear. You are going to summarize a video transcription into three or two parts, whatever makes sense to keep the context, providing from and to as the starting and ending points of each part. Explain the context of the video and the main points. The video is about a topic that you are familiar with, and you are going to summarize it in ${language}. Every part should be around 40 to 60 words.`,
        prompt: `Video transcription: ${chunk}`,
      });

      summary = [...summary, ...[object]];
    }

    return Response.json({
      summary,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Something went wrong: ", e);

    return Response.json({
      error: "Something went wrong: " + e,
    });
  }
}

function splitMessageIntoChunks(
  message: string,
  minChunkSize: number,
  maxChunkSize: number
): string[] {
  const chunks = [];
  let start = 0;

  while (start < message.length) {
    let end = start + maxChunkSize;

    if (end >= message.length) {
      chunks.push(message.slice(start));
      break;
    }

    // Find the last period within the range
    let periodIndex = message.lastIndexOf("}", end);

    if (periodIndex === -1 || periodIndex < start + minChunkSize) {
      // If no period is found within the range, split at maxChunkSize
      periodIndex = end;
    }

    chunks.push(message.slice(start, periodIndex + 1));
    start = periodIndex + 1;
  }

  return chunks;
}
