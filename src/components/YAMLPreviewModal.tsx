import { SelectedAgent } from "@/types/compass";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface YAMLPreviewModalProps {
  selectedAgents: SelectedAgent[];
  isOpen: boolean;
  onClose: () => void;
}

const generateYAML = (selectedAgents: SelectedAgent[]): string => {
  const agentNames = selectedAgents.map(sa => sa.agent.name).join(", ");
  
  const utilityAgents = selectedAgents.map(sa => {
    const agent = sa.agent;
    const similarity = ((1 - agent.distance) * 100).toFixed(1);
    
    return `  - agent_name: ${agent.name}
    agent_description: |
      ${agent.description}
    config:
      mcp_sse_url: "http://localhost:3000/sse"
      enable_interpreter: true
      tool_call_interval: 10
      max_tool_calls: 10
      llm_config:
        model: "gpt-4"
      contexts: []
      magic_prompt: |
        Agent: ${agent.name_id}
        Similarity: ${similarity}%`;
  }).join("\n\n");

  return `memory_config:
  chat_history:
    enabled: true
    max_messages: 50

orchestrator:
  agent_list: [${agentNames}]
  description: "Orchestrator managing task decomposition and agent coordination"
  llm_config:
    model: "gpt-4-turbo"

utility_agents:
${utilityAgents}

super_agents: []`;
};

export const YAMLPreviewModal = ({
  selectedAgents,
  isOpen,
  onClose,
}: YAMLPreviewModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const yaml = generateYAML(selectedAgents);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "YAML configuration has been copied",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orchestrator-config.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "orchestrator-config.yaml",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>YAML Orchestrator Configuration</DialogTitle>
          <DialogDescription>
            AIR SDK orchestrator configuration with {selectedAgents.length} selected agent{selectedAgents.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-[50vh]">
            <code>{yaml}</code>
          </pre>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download YAML
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
