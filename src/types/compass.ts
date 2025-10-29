export interface Agent {
  name: string;
  name_id: string;
  description: string;
  distance: number;
  functions?: {
    name: string;
    description?: string;
  }[];
}

export interface SearchQuery {
  query: string;
  reasoning: string;
}

export interface TaskAnalysis {
  original_task: string;
  searches: SearchQuery[];
}

export interface TaskQuality {
  needs_improvement?: boolean;
  [key: string]: any;
}

export interface SearchResponse {
  success: boolean;
  total_results: number;
  query: string;
  results: Agent[];
}

export interface AnalyzeTaskResponse {
  success: boolean;
  total_results: number;
  results: Agent[];
  task_analysis?: TaskAnalysis;
  needs_improvement?: boolean;
  task_quality?: TaskQuality;
}

export interface ImproveTaskResponse {
  success: boolean;
  improved_task: string;
}

export interface SelectedAgent {
  subtaskIndex: number;
  agent: Agent;
}
