export interface ResearchInput {
  niche: string;
  clientGoals: string;
  animationStyle: string;
  brandServices: string;
  clientName: string;
}

export interface ResearchOutput {
  trends: string;
  nicheTrends: string;
  colorPalettes: string;
  typography: string;
  homePageSections: string;
  secondPageSections: string;
  graphicStyles: string;
  moodEmotional: string;
  referenceSites: string;
  animations: string;
  uiComponents: string;
}

export interface SiteResult {
  name: string;
  url: string;
  source: string;
  description: string;
}

export interface SearchResults {
  globalTrends: SiteResult[];
  nicheTrends: SiteResult[];
  nicheReferenceSites: SiteResult[];
  animationInspiration: SiteResult[];
}
