import { Agent } from "@/types/compass";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultsTableProps {
  agents: Agent[];
  onShowDetails: (agent: Agent) => void;
}

export const ResultsTable = ({ agents, onShowDetails }: ResultsTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Agent Name</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold text-right">Similarity</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent, index) => {
            const similarity = ((1 - agent.distance) * 100).toFixed(1);
            return (
              <TableRow
                key={agent.name_id}
                className={index % 2 === 0 ? "bg-muted/30" : ""}
              >
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono">
                    {similarity}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowDetails(agent)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {agents.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
};
