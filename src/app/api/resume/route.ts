import { ResumeI, SummaryI } from "@/interface/resume.interface";
import { getYouTubeTranscript } from "@/utils/youtube-api";
import { CoreMessage, generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 60;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: ResumeI = await req.json();
    const { url, language } = body;

    // Create system messages as part of conversation history
    const messages = [
      {
        role: "system",
        content: `You are a professional summarizer, concise and clear. You will summarize video transcriptions into three or two parts, whatever makes sense to keep the context. Explain the context of the video and the main points. Provide summaries in ${language}. Every summary part should be around 100 words.`,
      },
      {
        role: "system",
        content: `For each transcription section, extract key knowledge and highlight main points. The goal is that users can get all knowledge from the video. Provide responses in ${language}.`,
      },
    ];

    const transcriptedVideo = await getYouTubeTranscript(url);
    const transcriptionIntoChunks = await splitMessageIntoChunks(
      JSON.stringify(transcriptedVideo)
    );

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = google("gemini-1.5-flash-latest");

    let summary: SummaryI[] = [];

    for (const chunk of transcriptionIntoChunks) {
      await delay(1000);

      // Add user message with current chunk
      messages.push({
        role: "user",
        content: `Video transcription part: ${chunk}`,
      });

      const { object } = await generateObject({
        model: model,
        schema: z.object({
          text: z
            .string()
            .describe("The summary of the transcription section."),
          from: z.string(),
          to: z.string(),
        }),
        messages: messages as CoreMessage[],
      });

      // Add assistant response to history
      messages.push({
        role: "assistant",
        content: object.text,
      });

      summary.push(object);
    }

    return Response.json({ summary });
  } catch (e) {
    return Response.json({
      error: "Something went wrong: " + e,
    });
  }
}

// Import the text splitter
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Replace the current splitMessageIntoChunks function with LangChain's splitter
async function splitMessageIntoChunks(message: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 20000,
    chunkOverlap: 100, // Add some overlap to maintain context between chunks
  });

  const docs = await splitter.createDocuments([message]);
  return docs.map((doc) => doc.pageContent);
}
