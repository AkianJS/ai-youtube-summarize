import { SummaryI } from "@/interface/resume.interface";
import Innertube from "youtubei.js";

export async function getYouTubeTranscript(videoUrl: string) {
  const videoId = new URL(videoUrl).searchParams.get("v") as string;
  const transcript = await fetchTranscript(videoId);
  return transcript;
}

const fetchTranscript = async (
  url: string
): Promise<SummaryI[] | undefined> => {
  const youtube = await Innertube.create({
    retrieve_player: false,
  });

  try {
    const info = await youtube.getInfo(url);
    const transcriptData = await info.getTranscript();

    return transcriptData?.transcript?.content?.body?.initial_segments.map(
      (segment) => ({
        text: segment.snippet.text as string,
        from: segment.start_ms,
        to: segment.end_ms,
      })
    );
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};
