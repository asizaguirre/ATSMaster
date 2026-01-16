
export interface LinkedInOptimization {
  suggestedHeadline: string;
  suggestedAbout: string;
  topSkillsToAdd: string[];
}

export interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  matchAnalysis: string;
  recommendation: string;
  linkedin: LinkedInOptimization;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
