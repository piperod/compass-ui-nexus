import { Agent, SearchQuery, SelectedAgent } from "@/types/compass";
import { RadioGroup } from "@/components/ui/radio-group";
import { AgentCard } from "./AgentCard";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface SubtaskColumnsProps {
  searches: SearchQuery[];
  agentsBySubtask: Agent[][];
  selectedAgents: SelectedAgent[];
  onSelectAgent: (subtaskIndex: number, agent: Agent) => void;
  onShowAgentDetails: (agent: Agent) => void;
  onSelectTop: () => void;
  onClearSelection: () => void;
}

const subtaskColors = ["subtask-1", "subtask-2", "subtask-3", "subtask-4"];

export const SubtaskColumns = ({
  searches,
  agentsBySubtask,
  selectedAgents,
  onSelectAgent,
  onShowAgentDetails,
  onSelectTop,
  onClearSelection,
}: SubtaskColumnsProps) => {
  const getSubtaskColor = (index: number) => {
    return subtaskColors[index % subtaskColors.length];
  };

  const hasSelection = selectedAgents.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onSelectTop}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Select Top Agents
        </Button>
        
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Clear Selection
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searches.map((search, index) => {
          const agents = agentsBySubtask[index] || [];
          const colorClass = getSubtaskColor(index);
          const selectedAgent = selectedAgents.find(s => s.subtaskIndex === index);

          return (
            <div
              key={index}
              className={`border-l-4 border-${colorClass} bg-card rounded-lg p-4 space-y-4`}
              style={{
                borderLeftColor: `hsl(var(--${colorClass}))`,
              }}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-base">{search.query}</h3>
                <p className="text-sm text-muted-foreground">{search.reasoning}</p>
              </div>

              <RadioGroup
                value={selectedAgent?.agent.name_id}
                className="space-y-3"
              >
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.name_id}
                    agent={agent}
                    subtaskIndex={index}
                    isSelected={selectedAgent?.agent.name_id === agent.name_id}
                    onSelect={() => onSelectAgent(index, agent)}
                    onShowDetails={() => onShowAgentDetails(agent)}
                  />
                ))}
              </RadioGroup>

              {agents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No agents found
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
