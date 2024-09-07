export interface ResumeI {
  url: string;
  language: string;
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
