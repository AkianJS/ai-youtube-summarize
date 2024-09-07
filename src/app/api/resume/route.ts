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
          from: z.string(),
          to: z.string(),
        }),
        system: `You are a professional summarizer, concise and clear. You are going to summarize a video transcription into three or two parts, whatever makes sense to keep the context. Explain the context of the video and the main points. Provide the summary in ${language}. Every summary part you answer should be around 60 words. Before each section of the summary, add a note specifying the exact timestamp in the video that corresponds to the summary you are providing. Before each dialogue, there are properties named 'from' and 'to' that represent the beginning and end of the dialogue, respectively. For instance, consider the following example: from: 145 to: 1002 text: "i did that, and you know" from: 1500 to: 2204 text: "yes, I know". In this case, you would send the summary using the 'from' timestamp of the beginning (from: 145) and the 'to' timestamp of the end (to: 2204).`,
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
