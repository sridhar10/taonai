import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, MessageSquare, Loader2 } from "lucide-react";
import { ScreeningCandidatesTable } from "./ScreeningCandidatesTable";
import { ScreeningCommunicationsTable } from "./ScreeningCommunicationsTable";
import { screeningCandidates, screeningCommunications } from "../../data/mockData";

export const ScreeningWorkflow = ({ 
  jobId, 
  onAutoAICall, 
  onPriorityReview, 
  onScreenAICall,
  onSetRules,
  searchingTabs = {}
}) => {
  const [activeTab, setActiveTab] = useState("candidates");

  const pendingCalls = screeningCandidates.filter(c => c.status === "pending_call").length;
  const completedCalls = screeningCommunications.filter(c => c.outcome === "showed_interest").length;

  return (
    <div data-testid="screening-workflow" className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
        <button
          data-testid="screening-candidates-tab"
          onClick={() => setActiveTab("candidates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "candidates"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users className="h-4 w-4" />
          Candidates
          <Badge 
            variant="secondary" 
            className={`text-[10px] ${activeTab === "candidates" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"}`}
          >
            {screeningCandidates.length}
          </Badge>
          {searchingTabs.candidates && (
            <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
          )}
        </button>
        <button
          data-testid="screening-communications-tab"
          onClick={() => setActiveTab("communications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "communications"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Communications
          <Badge 
            variant="secondary" 
            className={`text-[10px] ${activeTab === "communications" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"}`}
          >
            {screeningCommunications.length}
          </Badge>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "candidates" ? (
        <ScreeningCandidatesTable
          candidates={screeningCandidates}
          onAutoAICall={onAutoAICall}
          onPriorityReview={onPriorityReview}
          onScreenAICall={onScreenAICall}
        />
      ) : (
        <ScreeningCommunicationsTable
          communications={screeningCommunications}
          onSetRules={onSetRules}
        />
      )}
    </div>
  );
};
