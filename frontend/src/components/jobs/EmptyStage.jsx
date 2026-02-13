import { Badge } from "../ui/badge";
import { Users } from "lucide-react";

export function EmptyStage({ title, description, count }) {
  return (
    <div data-testid={`stage-${title.toLowerCase()}`} className="flex flex-col items-center justify-center py-20">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Users className="h-7 w-7 text-slate-400" />
      </div>
      <h3
        className="text-lg font-semibold text-slate-700 mb-1"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-3">
        {description}
      </p>
      <Badge variant="secondary" className="text-xs">
        {count} candidate{count !== 1 ? "s" : ""}
      </Badge>
    </div>
  );
}
