import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { CandidateTable } from "./CandidateTable";
import { getCandidatesByJobAndSource, getConsolidatedCandidates } from "../../data/mockData";
import { Database, Globe, Linkedin, Trophy, Search, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const sourcingTabs = [
  { key: "talentMatch", label: "Talent Match", icon: Database },
  { key: "syndication", label: "Syndication", icon: Globe },
  { key: "autoSourcing", label: "Auto Sourcing", icon: Linkedin },
  { key: "consolidated", label: "Consolidated", icon: Trophy },
];

const tabBanners = {
  talentMatch: { bg: "bg-sky-50/50 border-sky-100", text: "text-sky-700", icon: Database, msg: "Matching from your internal talent database. These candidates have been previously engaged." },
  syndication: { bg: "bg-amber-50/50 border-amber-100", text: "text-amber-700", icon: Globe, msg: "Candidates sourced from Naukri, Indeed, LinkedIn Jobs and other job boards." },
  autoSourcing: { bg: "bg-violet-50/50 border-violet-100", text: "text-violet-700", icon: Linkedin, msg: "AI-discovered passive candidates from LinkedIn. These may not be actively job seeking." },
  consolidated: { bg: "bg-indigo-50/50 border-indigo-100", text: "text-indigo-700", icon: Trophy, msg: "All candidates ranked by AI match score across all sourcing channels." },
};

export const SourcingWorkflow = ({ jobId, onSendMessage, onRefineSearch, searchingTabs = {} }) => {
  const [activeTab, setActiveTab] = useState("talentMatch");

  const talentMatchCandidates = getCandidatesByJobAndSource(jobId, "talentMatch");
  const syndicationCandidates = getCandidatesByJobAndSource(jobId, "syndication");
  const autoSourcingCandidates = getCandidatesByJobAndSource(jobId, "autoSourcing");
  const consolidatedCandidates = getConsolidatedCandidates(jobId);

  const tabCounts = {
    talentMatch: talentMatchCandidates.length,
    syndication: syndicationCandidates.length,
    autoSourcing: autoSourcingCandidates.length,
    consolidated: consolidatedCandidates.length,
  };

  const tabData = {
    talentMatch: talentMatchCandidates,
    syndication: syndicationCandidates,
    autoSourcing: autoSourcingCandidates,
    consolidated: consolidatedCandidates,
  };

  const handleMoveToNext = (candidate) => {
    toast.success(`${candidate.name} moved to Screening stage`);
  };

  const isAnySearching = Object.values(searchingTabs).some(Boolean);

  const TabHeader = ({ tab }) => {
    const Icon = tab.icon;
    const isSearching = searchingTabs[tab.key];
    return (
      <div className="flex items-center gap-2">
        {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" /> : <Icon className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{tab.label}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
          isSearching ? "bg-indigo-100 text-indigo-600 animate-pulse" : "bg-slate-200/70 text-slate-600"
        }`}>
          {isSearching ? "..." : tabCounts[tab.key]}
        </span>
      </div>
    );
  };

  return (
    <div data-testid="sourcing-workflow" className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Sourcing Workflow
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input data-testid="candidate-search-input" type="text" placeholder="Search candidates..."
              className="text-sm text-slate-600 placeholder:text-slate-400 bg-transparent outline-none w-40" />
          </div>
          <Button
            size="sm"
            data-testid="refine-search-btn"
            onClick={onRefineSearch}
            disabled={isAnySearching}
            className="text-xs h-8 gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Sparkles className="h-3 w-3" />
            Refine & Source
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-slate-100/80 p-1 text-slate-500 w-full border border-slate-200/50 flex-shrink-0">
          {sourcingTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} data-testid={`sourcing-tab-${tab.key}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
              <TabHeader tab={tab} />
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1 mt-4">
          {Object.keys(tabData).map((key) => {
            const banner = tabBanners[key];
            const BannerIcon = banner.icon;
            const isSearching = searchingTabs[key];
            return (
              <TabsContent key={key} value={key} className="mt-0">
                <div className={`mb-4 p-3 ${banner.bg} border rounded-lg`}>
                  <p className={`text-xs ${banner.text}`}>
                    <BannerIcon className="h-3 w-3 inline mr-1.5" />
                    {banner.msg}
                  </p>
                </div>

                {/* Searching indicator */}
                {isSearching && (
                  <div data-testid={`searching-indicator-${key}`}
                    className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-fade-in-up">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-700">Searching for candidates...</p>
                      <p className="text-xs text-indigo-500 mt-0.5">
                        AI is scanning {key === "talentMatch" ? "internal database" : key === "syndication" ? "job boards" : "LinkedIn"} with your refined criteria. Results will appear shortly.
                      </p>
                    </div>
                  </div>
                )}

                <CandidateTable
                  candidates={tabData[key]}
                  onSendMessage={onSendMessage}
                  onMoveToNext={handleMoveToNext}
                />
              </TabsContent>
            );
          })}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
