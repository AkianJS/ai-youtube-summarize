import { ResumeI, SummaryI } from "@/interface/resume.interface";
import { getYouTubeTranscript } from "@/utils/youtube-api";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: ResumeI = await req.json();
    const { url } = body;

    const transcriptedVideo = await getYouTubeTranscript(url);

    const transcriptionIntoChunks = splitMessageIntoChunks(
      JSON.stringify(transcriptedVideo),
      10000,
      10500
    );

    let summary: SummaryI[] = [];

    for (const chunk of transcriptionIntoChunks) {
      const { text } = await generateText({
        model: google("gemini-1.5-flash-latest"),
        temperature: 0.2,
        system:
          "Professional summarizer, concise and clear, highlighting key points.",
        prompt: `Provide a plain text response in JSON format without formatting indicators, i should be able to use JSON.parse and get an object, it should be an array of objects with the following format: [{"text": "<summary>", "from": "<return "from" number as string>", to: "<return "to" number as string>"}]. Summarize the following video transcription in 3 parts. Video transcription: ${chunk}`,
      });
      const parsedText: SummaryI[] = JSON.parse(text);
      summary = [...summary, ...parsedText];
    }

    return Response.json({
      summary,
    });
  } catch (e) {
    console.error("Something went wrong: ", e);
    return Response.json({
      error: "Something went wrong, try again later",
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
