import { Agent } from "@/types/compass";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  subtaskIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onShowDetails: () => void;
}

export const AgentCard = ({
  agent,
  subtaskIndex,
  isSelected,
  onSelect,
  onShowDetails,
}: AgentCardProps) => {
  const similarity = ((1 - agent.distance) * 100).toFixed(1);
  
  return (
    <Card
      className={`p-4 transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <RadioGroupItem
            value={agent.name_id}
            id={`${subtaskIndex}-${agent.name_id}`}
            checked={isSelected}
            onClick={onSelect}
          />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Label
              htmlFor={`${subtaskIndex}-${agent.name_id}`}
              className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
            >
              {agent.name}
            </Label>
            <Badge variant="outline" className="shrink-0 font-mono text-xs">
              {similarity}%
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-1">
            {agent.description}
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowDetails}
            className="h-auto p-0 text-xs text-primary hover:text-primary/80"
          >
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
