

export interface FpsScenario {
  name: string;
  resolution: string;
  settings: string;
  avgFps: string;
  analysis: string;
}

export interface ComponentAnalysis {
  component: 'CPU' | 'GPU' | 'RAM' | 'Virtual RAM';
  model: string;
  analysis: string;
}

export interface AnalysisResult {
  summary: string;
  keyFactor: string;
  bottleneckComponent: string;
  bottleneckExplanation: string;
  upgradeSuggestion: string;
  estimatedPowerDraw: string;
  performanceScore: number;
  componentBreakdown: ComponentAnalysis[];
  scenarios: FpsScenario[];
}

export interface DeviceSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  ramMhz?: string;
}

export interface SavedAnalysisResult extends AnalysisResult {
  id: string;
  gameName: string;
  deviceSpecs: DeviceSpecs;
  savedAt: string;
}

export type Translations = Record<string, Record<string, string>>;