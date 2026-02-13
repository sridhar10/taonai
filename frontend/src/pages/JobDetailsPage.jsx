import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ChatPanel } from "../components/layout/ChatPanel";
import { PipelineStepper } from "../components/jobs/PipelineStepper";
import { SourcingWorkflow } from "../components/sourcing/SourcingWorkflow";
import { ScreeningWorkflow } from "../components/screening/ScreeningWorkflow";
import { EmptyStage } from "../components/jobs/EmptyStage";
import { jobs } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, MapPin, Clock, Banknote, Calendar } from "lucide-react";

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
    const newTabs = {};
    sources.forEach((s) => {
      newTabs[s] = true;
    });
    setSearchingTabs(newTabs);
    setTimeout(() => {
      setSearchingTabs({});
    }, 6000);
  }, []);

  const handleSetRules = useCallback(() => {
    setChatMode("rules");
    setChatVisible(true);
  }, []);

  // Screening handlers
  const handleAutoAICall = useCallback((candidates) => {
    setChatMode("autoai_call");
    setOutreachCandidates(candidates);
    setChatVisible(true);
  }, []);

  const handlePriorityReview = useCallback((candidates) => {
    setChatMode("priority_review");
    setOutreachCandidates(candidates);
    setChatVisible(true);
  }, []);

  const handleScreenAICall = useCallback((candidates) => {
    setChatMode("screenai_call");
    setOutreachCandidates(candidates);
    setChatVisible(true);
  }, []);

  const handleScreeningRules = useCallback(() => {
    setChatMode("screening_rules");
    setChatVisible(true);
  }, []);

  const handleToggleChat = useCallback(() => {
    setChatVisible((v) => !v);
  }, []);

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 text-sm">Job not found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/jobs")}
              className="mt-4"
              data-testid="go-back-button"
            >
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderStageContent = () => {
    if (activeStage === "sourcing") {
      return (
        <SourcingWorkflow
          jobId={job.id}
          onSendMessage={handleSendMessage}
          onRefineSearch={handleRefineSearch}
          onSetRules={handleSetRules}
          searchingTabs={searchingTabs}
        />
      );
    }
    if (activeStage === "recruitment") {
      return (
        <ScreeningWorkflow
          jobId={job.id}
          onAutoAICall={handleAutoAICall}
          onPriorityReview={handlePriorityReview}
          onScreenAICall={handleScreenAICall}
          onSetRules={handleScreeningRules}
        />
      );
    }
    if (activeStage === "interview") {
      return (
        <EmptyStage
          title="Interview"
          description="Scheduled and completed interviews will be tracked here."
          count={job.pipeline.interview}
        />
      );
    }
    if (activeStage === "offer") {
      return (
        <EmptyStage
          title="Offer"
          description="Candidates with pending and accepted offers."
          count={job.pipeline.offer}
        />
      );
    }
    if (activeStage === "joined") {
      return (
        <EmptyStage
          title="Joined"
          description="Successfully onboarded candidates."
          count={job.pipeline.joined}
        />
      );
    }
    return null;
  };

  const renderChatPanel = () => {
    if (activeStage !== "sourcing" && activeStage !== "recruitment") {
      return null;
    }
    return (
      <ChatPanel
        jobTitle={job.title}
        jobId={job.id}
        isVisible={chatVisible}
        onToggle={handleToggleChat}
        chatMode={chatMode}
        outreachCandidates={outreachCandidates}
        onModeChange={handleModeChange}
        onSearchStart={handleSearchStart}
        activeStage={activeStage}
      />
    );
  };

  return (
    <DashboardLayout chatPanel={renderChatPanel()}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex items-center gap-4 px-8 border-b border-slate-200 bg-white flex-shrink-0">
          <button
            data-testid="back-to-jobs"
            onClick={() => navigate("/jobs")}
            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors btn-press"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="text-lg font-bold text-slate-900 truncate"
                style={{ fontFamily: "Manrope, sans-serif" }}
                data-testid="job-detail-title"
              >
                {job.title}
              </h1>
              <Badge
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] hover:bg-emerald-50"
                variant="outline"
              >
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.experience}
              </span>
              <span className="flex items-center gap-1">
                <Banknote className="h-3 w-3" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Posted {job.posted}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              data-testid="edit-job-button"
              className="text-xs h-8"
            >
              Edit Job
            </Button>
            <Button
              size="sm"
              data-testid="share-job-button"
              className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700"
            >
              Share
            </Button>
          </div>
        </div>

        <div className="px-8 pt-6 bg-white border-b border-slate-200 flex-shrink-0">
          <PipelineStepper
            activeStage={activeStage}
            onStageClick={setActiveStage}
            pipelineCounts={job.pipeline}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {renderStageContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
