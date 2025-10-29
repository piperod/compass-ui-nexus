import { useState } from "react";
import { Header } from "@/components/Header";
import { TaskInput } from "@/components/TaskInput";
import { SubtaskColumns } from "@/components/SubtaskColumns";
import { ResultsTable } from "@/components/ResultsTable";
import { AgentDetailsModal } from "@/components/AgentDetailsModal";
import { YAMLPreviewModal } from "@/components/YAMLPreviewModal";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Agent,
  AnalyzeTaskResponse,
  SearchResponse,
  SelectedAgent,
} from "@/types/compass";

const Index = () => {
  const [task, setTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [taskAnalysis, setTaskAnalysis] = useState<AnalyzeTaskResponse | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<SelectedAgent[]>([]);
  const [detailsAgent, setDetailsAgent] = useState<Agent | null>(null);
  const [showYAML, setShowYAML] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: task, top_k: 10 }),
      });
      
      const data: SearchResponse = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
        setTaskAnalysis(null);
        toast({
          title: "Search completed",
          description: `Found ${data.total_results} agents`,
        });
      } else {
        throw new Error("Search failed");
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to retrieve agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, top_k: 10 }),
      });
      
      const data: AnalyzeTaskResponse = await response.json();
      
      if (data.success) {
        setTaskAnalysis(data);
        setSearchResults([]);
        setSelectedAgents([]);
        
        if (data.needs_improvement) {
          toast({
            title: "Task needs improvement",
            description: "Consider refining your task description for better results.",
            variant: "default",
          });
        } else {
          toast({
            title: "Analysis completed",
            description: `Task decomposed into ${data.task_analysis?.searches.length || 0} subtasks`,
          });
        }
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      toast({
        title: "Evaluation failed",
        description: "Unable to analyze task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAgent = (subtaskIndex: number, agent: Agent) => {
    setSelectedAgents((prev) => {
      const existing = prev.filter((s) => s.subtaskIndex !== subtaskIndex);
      return [...existing, { subtaskIndex, agent }];
    });
  };

  const handleSelectTop = () => {
    if (!taskAnalysis?.task_analysis) return;
    
    const topAgents: SelectedAgent[] = [];
    taskAnalysis.task_analysis.searches.forEach((search, index) => {
      const agents = getAgentsForSubtask(index);
      if (agents.length > 0) {
        topAgents.push({ subtaskIndex: index, agent: agents[0] });
      }
    });
    
    setSelectedAgents(topAgents);
    toast({
      title: "Top agents selected",
      description: `Selected ${topAgents.length} top-ranked agents`,
    });
  };

  const handleClearSelection = () => {
    setSelectedAgents([]);
    toast({
      title: "Selection cleared",
      description: "All agent selections have been cleared",
    });
  };

  const getAgentsForSubtask = (subtaskIndex: number): Agent[] => {
    if (!taskAnalysis?.results) return [];
    // In a real implementation, agents would be pre-grouped by subtask
    // For now, we'll distribute them evenly
    const agentsPerSubtask = Math.ceil(
      taskAnalysis.results.length / (taskAnalysis.task_analysis?.searches.length || 1)
    );
    const start = subtaskIndex * agentsPerSubtask;
    const end = start + agentsPerSubtask;
    return taskAnalysis.results.slice(start, end).sort((a, b) => a.distance - b.distance);
  };

  const agentsBySubtask = taskAnalysis?.task_analysis?.searches.map((_, index) =>
    getAgentsForSubtask(index)
  ) || [];

  const totalResults = taskAnalysis?.total_results || searchResults.length;
  const hasResults = totalResults > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header resultsCount={hasResults ? totalResults : undefined} />
      
      <main className="container px-4 py-8 space-y-8">
        <TaskInput
          value={task}
          onChange={setTask}
          onSearch={handleSearch}
          onEvaluate={handleEvaluate}
          isLoading={isLoading}
        />

        {hasResults && selectedAgents.length > 0 && (
          <div className="flex justify-center">
            <Button onClick={() => setShowYAML(true)} className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Orchestrator YAML
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="mt-4 text-muted-foreground">Processing your request...</p>
          </div>
        )}

        {!isLoading && taskAnalysis?.task_analysis && (
          <SubtaskColumns
            searches={taskAnalysis.task_analysis.searches}
            agentsBySubtask={agentsBySubtask}
            selectedAgents={selectedAgents}
            onSelectAgent={handleSelectAgent}
            onShowAgentDetails={setDetailsAgent}
            onSelectTop={handleSelectTop}
            onClearSelection={handleClearSelection}
          />
        )}

        {!isLoading && searchResults.length > 0 && !taskAnalysis && (
          <ResultsTable
            agents={searchResults}
            onShowDetails={setDetailsAgent}
          />
        )}

        {!isLoading && !hasResults && task && (
          <div className="text-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try refining your search terms or use a different approach to find relevant agents.
            </p>
          </div>
        )}

        {!isLoading && !task && !hasResults && (
          <div className="text-center py-16 space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Ready to find agents</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a task description above to search for agents or evaluate your prompt quality.
            </p>
          </div>
        )}
      </main>

      <AgentDetailsModal
        agent={detailsAgent}
        isOpen={!!detailsAgent}
        onClose={() => setDetailsAgent(null)}
      />

      <YAMLPreviewModal
        selectedAgents={selectedAgents}
        isOpen={showYAML}
        onClose={() => setShowYAML(false)}
      />
    </div>
  );
};

export default Index;
