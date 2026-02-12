import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ChatPanel } from "../components/layout/ChatPanel";
import { PipelineStepper } from "../components/jobs/PipelineStepper";
import { SourcingWorkflow } from "../components/sourcing/SourcingWorkflow";
import { jobs } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, MapPin, Clock, IndianRupee, Users, Calendar } from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState("sourcing");
  const [chatVisible, setChatVisible] = useState(true);
  const [chatMode, setChatMode] = useState("default");
  const [outreachCandidates, setOutreachCandidates] = useState([]);
  const [searchingTabs, setSearchingTabs] = useState({});

  const job = jobs.find((j) => j.id === id);

  const handleSendMessage = useCallback((candidates) => {
    setOutreachCandidates(candidates);
    setChatMode("outreach");
    setChatVisible(true);
  }, []);

  const handleRefineSearch = useCallback(() => {
    setChatMode("search");
    setChatVisible(true);
  }, []);

  const handleModeChange = useCallback((mode) => {
    setChatMode(mode);
    if (mode === "default") {
      setOutreachCandidates([]);
    }
  }, []);

  const handleSearchStart = useCallback((sources) => {
    const tabs = {};
    sources.forEach((s) => { tabs[s] = true; });
    setSearchingTabs(tabs);
    // Simulate search completing after 6 seconds
    setTimeout(() => {
      setSearchingTabs({});
    }, 6000);
  }, []);

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 text-sm">Job not found</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/jobs")} className="mt-4" data-testid="go-back-button">
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderStageContent = () => {
    switch (activeStage) {
      case "sourcing":
        return (
          <SourcingWorkflow
            jobId={job.id}
            onSendMessage={handleSendMessage}
            onRefineSearch={handleRefineSearch}
            searchingTabs={searchingTabs}
          />
        );
      case "recruitment":
        return <EmptyStage title="Screening" description="Candidates in the screening phase will appear here." count={job.pipeline.recruitment} />;
      case "interview":
        return <EmptyStage title="Interview" description="Scheduled and completed interviews will be tracked here." count={job.pipeline.interview} />;
      case "offer":
        return <EmptyStage title="Offer" description="Candidates with pending and accepted offers." count={job.pipeline.offer} />;
      case "joined":
        return <EmptyStage title="Joined" description="Successfully onboarded candidates." count={job.pipeline.joined} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      chatPanel={
        activeStage === "sourcing" ? (
          <ChatPanel
            jobTitle={job.title}
            jobId={job.id}
            isVisible={chatVisible}
            onToggle={() => setChatVisible(!chatVisible)}
            chatMode={chatMode}
            outreachCandidates={outreachCandidates}
            onModeChange={handleModeChange}
            onSearchStart={handleSearchStart}
          />
        ) : null
      }
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 flex items-center gap-4 px-8 border-b border-slate-200 bg-white flex-shrink-0">
          <button data-testid="back-to-jobs" onClick={() => navigate("/jobs")}
            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors btn-press">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 truncate" style={{ fontFamily: "Manrope, sans-serif" }} data-testid="job-detail-title">
                {job.title}
              </h1>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] hover:bg-emerald-50" variant="outline">
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.experience}</span>
              <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {job.salary}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Posted {job.posted}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" data-testid="edit-job-button" className="text-xs h-8">Edit Job</Button>
            <Button size="sm" data-testid="share-job-button" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700">Share</Button>
          </div>
        </div>

        {/* Pipeline */}
        <div className="px-8 pt-6 bg-white border-b border-slate-200 flex-shrink-0">
          <PipelineStepper activeStage={activeStage} onStageClick={setActiveStage} pipelineCounts={job.pipeline} />
        </div>

        {/* Stage Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderStageContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmptyStage({ title, description, count }) {
  return (
    <div data-testid={`stage-${title.toLowerCase()}`} className="flex flex-col items-center justify-center py-20">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Users className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-3">{description}</p>
      <Badge variant="secondary" className="text-xs">{count} candidate{count !== 1 ? "s" : ""}</Badge>
    </div>
  );
}
