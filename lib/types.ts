export type Platform = "LinkedIn" | "Facebook" | "Instagram";

export type Draft = {
  id: string;
  title: string;
  platform: Platform;
  finalPost: string;
  hashtags: string[];
  imagePrompt?: string;
  generatedImage?: string;
  dateCreated: string;
};

export type PostGenerationResult = {
  finalPost: string;
  alternativeHooks: string[];
  ctaOptions: string[];
  platformVersion: string;
  hashtags: {
    broad: string[];
    niche: string[];
    local: string[];
    engagement: string[];
  };
  imageConcept: string;
};
