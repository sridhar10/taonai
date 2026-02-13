import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { CandidateTable } from "./CandidateTable";
import { CommunicationsTable } from "./CommunicationsTable";
import { getAllCandidates } from "../../data/mockData";
import { Users, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const SourcingWorkflow = ({ jobId, onSendMessage, onRefineSearch, onSetRules, searchingTabs = {} }) => {
  const [activeSection, setActiveSection] = useState("candidates");
  const allCandidates = getAllCandidates();

  const handleMoveToNext = (candidate) => {
    toast.success(`${candidate.name} moved to Screening stage`);
  };

  const handleResend = (com) => {
    toast.info(`Resending message to ${com.candidateName}...`);
  };

  const handleSendNew = (com) => {
    const candidate = { id: com.candidateId, name: com.candidateName };
    onSendMessage([candidate]);
  };

  const isAnySearching = Object.values(searchingTabs).some(Boolean);

  return (
    <div data-testid="sourcing-workflow" className="flex-1 flex flex-col overflow-hidden">
      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <TabsList className="inline-flex h-10 items-center rounded-lg bg-slate-100/80 p-1 text-slate-500 border border-slate-200/50">
            <TabsTrigger
              value="candidates"
              data-testid="section-candidates"
              className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <Users className="h-3.5 w-3.5" />
              Candidates
              <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                {allCandidates.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="communications"
              data-testid="section-communications"
              className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Communications
              <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                7
              </span>
            </TabsTrigger>
          </TabsList>

          {/* CTAs based on section */}
          {activeSection === "candidates" && (
            <Button
              size="sm"
              data-testid="refine-search-btn"
              onClick={onRefineSearch}
              disabled={isAnySearching}
              className="text-xs h-8 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isAnySearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              Refine & Source
            </Button>
          )}
        </div>

        {/* Searching indicator */}
        {isAnySearching && activeSection === "candidates" && (
          <div
            data-testid="searching-indicator"
            className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-fade-in-up flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-700">Searching for candidates...</p>
              <p className="text-xs text-indigo-500 mt-0.5">
                AI is scanning selected sources with your refined criteria. Results will appear shortly.
              </p>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <TabsContent value="candidates" className="mt-0">
            <CandidateTable
              candidates={allCandidates}
              onSendMessage={onSendMessage}
              onMoveToNext={handleMoveToNext}
            />
          </TabsContent>

          <TabsContent value="communications" className="mt-0">
            <CommunicationsTable
              onResend={handleResend}
              onSendNew={handleSendNew}
              onSetRules={onSetRules}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
