
export interface Correction {
  original: string;
  corrected: string;
}

export interface CorrectionResponse {
  correctedText: string;
  corrections: Correction[];
}

export interface KeywordsResponse {
  shortTailKeywords: string[];
  longTailKeywords: string[];
}
