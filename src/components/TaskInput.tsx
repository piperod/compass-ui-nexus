import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Loader2 } from "lucide-react";

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onEvaluate: () => void;
  isLoading?: boolean;
}

export const TaskInput = ({
  value,
  onChange,
  onSearch,
  onEvaluate,
  isLoading = false,
}: TaskInputProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What would you like to do?"
          className="min-h-[120px] resize-none text-base"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Describe your task in detail. The system will find the best agents and decompose complex tasks automatically.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onSearch}
          disabled={isLoading || !value.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search & Retrieve Agents
        </Button>
        
        <Button
          variant="secondary"
          onClick={onEvaluate}
          disabled={isLoading || !value.trim()}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Evaluate Prompt Quality
        </Button>
      </div>
    </div>
  );
};
