import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { CandidateCard } from "./CandidateCard";
import { getCandidatesByJobAndSource, getConsolidatedCandidates } from "../../data/mockData";
import { Database, Globe, Linkedin, Trophy, Search } from "lucide-react";

const sourcingTabs = [
  { key: "talentMatch", label: "Talent Match", icon: Database, description: "Internal database matches" },
  { key: "syndication", label: "Syndication", icon: Globe, description: "Job board applicants" },
  { key: "autoSourcing", label: "Auto Sourcing", icon: Linkedin, description: "LinkedIn passive sourcing" },
  { key: "consolidated", label: "Consolidated", icon: Trophy, description: "Ranked from all sources" },
];

export const SourcingWorkflow = ({ jobId }) => {
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

  const renderCandidateList = (candidates, showRank = false) => (
    <div className="space-y-2">
      {candidates.map((c, idx) => (
        <CandidateCard key={c.id} candidate={c} rank={showRank ? idx + 1 : null} />
      ))}
    </div>
  );

  const TabHeader = ({ tab }) => {
    const Icon = tab.icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{tab.label}</span>
        <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
          {tabCounts[tab.key]}
        </span>
      </div>
    );
  };

  return (
    <div data-testid="sourcing-workflow" className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Sourcing Workflow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-powered candidate discovery across multiple channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              data-testid="candidate-search-input"
              type="text"
              placeholder="Search candidates..."
              className="text-sm text-slate-600 placeholder:text-slate-400 bg-transparent outline-none w-40"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-slate-100/80 p-1 text-slate-500 w-full border border-slate-200/50 flex-shrink-0">
          {sourcingTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              data-testid={`sourcing-tab-${tab.key}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <TabHeader tab={tab} />
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1 mt-4">
          <TabsContent value="talentMatch" className="mt-0">
            <div className="mb-4 p-3 bg-sky-50/50 border border-sky-100 rounded-lg">
              <p className="text-xs text-sky-700">
                <Database className="h-3 w-3 inline mr-1.5" />
                Matching from your internal talent database. These candidates have been previously engaged.
              </p>
            </div>
            {renderCandidateList(talentMatchCandidates)}
          </TabsContent>

          <TabsContent value="syndication" className="mt-0">
            <div className="mb-4 p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-700">
                <Globe className="h-3 w-3 inline mr-1.5" />
                Candidates sourced from Naukri, Indeed, LinkedIn Jobs and other job boards.
              </p>
            </div>
            {renderCandidateList(syndicationCandidates)}
          </TabsContent>

          <TabsContent value="autoSourcing" className="mt-0">
            <div className="mb-4 p-3 bg-violet-50/50 border border-violet-100 rounded-lg">
              <p className="text-xs text-violet-700">
                <Linkedin className="h-3 w-3 inline mr-1.5" />
                AI-discovered passive candidates from LinkedIn. These may not be actively job seeking.
              </p>
            </div>
            {renderCandidateList(autoSourcingCandidates)}
          </TabsContent>

          <TabsContent value="consolidated" className="mt-0">
            <div className="mb-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
              <p className="text-xs text-indigo-700">
                <Trophy className="h-3 w-3 inline mr-1.5" />
                All candidates ranked by AI match score across all sourcing channels.
              </p>
            </div>
            {renderCandidateList(consolidatedCandidates, true)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
