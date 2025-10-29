import { Agent } from "@/types/compass";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AgentDetailsModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: () => void;
}

export const AgentDetailsModal = ({
  agent,
  isOpen,
  onClose,
  onSelect,
}: AgentDetailsModalProps) => {
  if (!agent) return null;

  const similarity = ((1 - agent.distance) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{agent.name}</DialogTitle>
          <DialogDescription>Agent details and capabilities</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Agent ID</h3>
            <code className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
              {agent.name_id}
            </code>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Similarity Score</h3>
            <Badge variant="secondary" className="font-mono">
              {similarity}%
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {agent.description}
            </p>
          </div>

          {agent.functions && agent.functions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Functions ({agent.functions.length})
                </h3>
                <div className="space-y-3">
                  {agent.functions.map((func, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg space-y-1"
                    >
                      <code className="text-sm font-mono font-semibold">
                        {func.name}
                      </code>
                      {func.description && (
                        <p className="text-xs text-muted-foreground">
                          {func.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onSelect && (
            <Button onClick={onSelect}>Select Agent</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
