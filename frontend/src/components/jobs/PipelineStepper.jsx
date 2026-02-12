import { Check, Search, UserCheck, MessageSquare, FileText, PartyPopper } from "lucide-react";

const stages = [
  { key: "sourcing", label: "Sourcing", icon: Search },
  { key: "recruitment", label: "Screening", icon: UserCheck },
  { key: "interview", label: "Interview", icon: MessageSquare },
  { key: "offer", label: "Offer", icon: FileText },
  { key: "joined", label: "Joined", icon: PartyPopper },
];

export const PipelineStepper = ({ activeStage, onStageClick, pipelineCounts }) => {
  const activeIndex = stages.findIndex((s) => s.key === activeStage);

  return (
    <div data-testid="pipeline-stepper" className="flex items-center w-full mb-8">
      {stages.map((stage, idx) => {
        const Icon = stage.icon;
        const isActive = stage.key === activeStage;
        const isPast = idx < activeIndex;
        const count = pipelineCounts?.[stage.key] || 0;

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-initial">
            <button
              data-testid={`pipeline-stage-${stage.key}`}
              onClick={() => onStageClick(stage.key)}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium
                transition-all duration-200 btn-press whitespace-nowrap
                ${isActive
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm"
                  : isPast
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : isPast
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isPast ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
              </span>
              <span className="hidden lg:inline">{stage.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : isPast
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
            {idx < stages.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 ${
                  idx < activeIndex ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
