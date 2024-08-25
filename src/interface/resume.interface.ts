export interface ResumeI {
  url: string;
}

export interface ResumeApiResponseI {
  summary?: SummaryI[];
  error?: string;
}

export type SummaryI = {
  text: string;
  from: string;
  to: string;
};
