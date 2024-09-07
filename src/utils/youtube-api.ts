import { SummaryI } from "@/interface/resume.interface";
import Innertube from "youtubei.js";
/*
  * This function get the parameters of a YouTube video URL and returns the transcript of the video.
  @param videoUrl - The URL of the YouTube video.
*/
export async function getYouTubeTranscript(videoUrl: string) {
  const videoId = new URL(videoUrl).searchParams.get("v") as string;
  const transcript = await fetchTranscript(videoId);
  return transcript;
}

/*
  * This function fetches the transcript of a YouTube video using the youtubei.js package.
  * It takes a video ID and returns an array of objects.
  * Each object contains the text of a segment of the transcript and the start and end time of the segment.
  @param url - The ID of the YouTube video.
  @returns An array of objects containing the text of the transcript segments and their start and end times.
*/
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
    // eslint-disable-next-line no-console
    console.error("Error fetching transcript:", error);
    throw error;
  }
};
