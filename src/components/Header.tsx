import compassLogo from "@/assets/logo.svg";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  resultsCount?: number;
  status?: string;
}

export const Header = ({ resultsCount, status }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src={compassLogo} alt="Compass" className="h-8 w-8" />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Compass
          </h1>
        </div>
        
        {(resultsCount !== undefined || status) && (
          <div className="flex items-center gap-3 text-sm">
            {resultsCount !== undefined && (
              <span className="text-muted-foreground">
                {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
              </span>
            )}
            {status && (
              <Badge variant="secondary" className="font-medium">
                {status}
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
