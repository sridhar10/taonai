import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, X, MessageSquare, Mail, MessageCircle, Linkedin, Check, Loader2, Pencil, Trash2, Bot, Star, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { initialChatMessages, screeningChatMessages, screeningRules } from "../../data/mockData";
import { jobs, getInitials, getAvatarColor } from "../../data/mockData";

const channels = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "bg-green-50 text-green-700 border-green-200" },
  { key: "email", label: "Email", icon: Mail, color: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "linkedin", label: "LinkedIn InMail", icon: Linkedin, color: "bg-blue-50 text-blue-700 border-blue-200" },
];

const searchQuestions = [
  { key: "must_have", question: "What are the must-have skills you're looking for?", placeholder: "e.g. Go, Kubernetes, 5+ years distributed systems..." },
  { key: "exclude", question: "Any skills, traits, or backgrounds you want to exclude?", placeholder: "e.g. No freshers, avoid consulting firms..." },
  { key: "companies", question: "Any specific companies or categories to target?", placeholder: "e.g. FAANG, funded startups, fintech..." },
  { key: "sources", question: "Which sources should I search on?", placeholder: "Select sources below" },
];

const sourceOptions = [
  { key: "talentMatch", label: "Internal Database" },
  { key: "syndication", label: "Job Board Profiles" },
  { key: "autoSourcing", label: "LinkedIn" },
];

const defaultRulesData = [
  { id: "r1", label: "Send follow-up in 24 hours if no response", active: true },
  { id: "r2", label: "If response is positive, move candidate to Screening stage", active: true },
  { id: "r3", label: "Send a custom empathetic reply for negative responses", active: true },
];

const ruleQuestions = [
  { key: "trigger", question: "What should trigger this rule? (e.g., no response in 48 hours, candidate asks about salary)", placeholder: "e.g. no response in 48 hours..." },
  { key: "action", question: "What action should be taken? (e.g., send reminder, move to stage, notify recruiter)", placeholder: "e.g. send a reminder message..." },
  { key: "channel", question: "Which channel should this apply to? (all, email, whatsapp, linkedin)", placeholder: "e.g. all channels" },
];

const screeningRuleQuestions = [
  { key: "trigger", question: "What should trigger this AutoAI rule? (e.g., new candidate in screening, no response after call)", placeholder: "e.g. new candidate in screening..." },
  { key: "action", question: "What action should be taken? (e.g., initiate call, send WhatsApp, schedule follow-up)", placeholder: "e.g. initiate AutoAI call..." },
  { key: "timing", question: "When should this happen? (e.g., immediately, after 2 hours, next business day)", placeholder: "e.g. within 2 hours" },
];

const generateOutreachMessage = (channel, candidates, jobId) => {
  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const name = candidates.length === 1 ? candidates[0].name.split(" ")[0] : "there";
  const link = `https://1recruit.ai/apply/${job.id}`;
  if (channel === "whatsapp") return `Hi ${name},\n\nWe have an exciting opportunity for *${job.title}* at *1Recruit Technologies*.\n\nLocation: ${job.location}\nExperience: ${job.experience}\nCompensation: ${job.salary}\nNotice Period: Immediate to 30 days preferred\n\nApply here: ${link}\n\nBest,\n1Recruit Talent Team`;
  if (channel === "linkedin") return `Hi ${name},\n\nI'm reaching out from 1Recruit Technologies \u2014 we're hiring a ${job.title} for our ${job.location} office.\n\n\u2022 ${job.experience} experience\n\u2022 ${job.salary} compensation\n\u2022 Skills: ${job.skills.slice(0, 3).join(", ")}\n\u2022 Notice Period: Immediate to 30 days\n\nApply: ${link}\n\nBest,\n1Recruit Talent Team`;
  return `Subject: ${job.title} Opportunity \u2013 ${job.location}\n\nDear ${name},\n\nI\u2019m reaching out regarding the ${job.title} role at 1Recruit Technologies, ${job.location}.\n\n\u2022 Experience: ${job.experience}\n\u2022 Compensation: ${job.salary}\n\u2022 Notice Period: Immediate to 30 days\n\nKey Skills: ${job.skills.join(", ")}\n\nApply here: ${link}\n\nBest regards,\n1Recruit Talent Acquisition`;
};

export const ChatPanel = ({ jobTitle, jobId, isVisible, onToggle, chatMode, outreachCandidates, onModeChange, onSearchStart, activeStage = "sourcing" }) => {
  const isScreening = activeStage === "recruitment";
  const [messages, setMessages] = useState(isScreening ? screeningChatMessages : initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [searchAnswers, setSearchAnswers] = useState({});
  const [selectedSources, setSelectedSources] = useState([]);
  const [outreachStep, setOutreachStep] = useState("channel");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [currentRules, setCurrentRules] = useState(defaultRulesData);
  const [screeningCurrentRules, setScreeningCurrentRules] = useState(screeningRules);
  const [newRuleStep, setNewRuleStep] = useState(0);
  const [newRuleData, setNewRuleData] = useState({});
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const prevModeRef = useRef("default");
  const prevStageRef = useRef(activeStage);

  // Reset messages when stage changes
  useEffect(() => {
    if (prevStageRef.current !== activeStage) {
      setMessages(activeStage === "recruitment" ? screeningChatMessages : initialChatMessages);
      prevStageRef.current = activeStage;
      prevModeRef.current = "default";
    }
  }, [activeStage]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const addMsg = useCallback((role, content) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content, timestamp: now() }]);
  }, []);

  // Mode triggers
  useEffect(() => {
    if (chatMode === "outreach" && outreachCandidates.length > 0 && prevModeRef.current !== "outreach") {
      const names = outreachCandidates.map((c) => c.name.split(" ")[0]).join(", ");
      addMsg("assistant", `I'll help you reach out to ${outreachCandidates.length > 1 ? `${outreachCandidates.length} candidates: ${names}` : names}.\n\nHow would you like to contact them?`);
      setOutreachStep("channel");
    }
    if (chatMode === "search" && searchStep === 0 && prevModeRef.current !== "search") {
      addMsg("assistant", "Let\u2019s refine your sourcing criteria.\n\n" + searchQuestions[0].question);
      setSearchStep(1);
    }
    if (chatMode === "rules" && prevModeRef.current !== "rules") {
      setNewRuleStep(0);
      setNewRuleData({});
    }
    // Screening mode triggers
    if (chatMode === "autoai_call" && outreachCandidates.length > 0 && prevModeRef.current !== "autoai_call") {
      const names = outreachCandidates.map((c) => c.name.split(" ")[0]).join(", ");
      addMsg("assistant", `Initiating AutoAI screening call for ${outreachCandidates.length > 1 ? `${outreachCandidates.length} candidates: ${names}` : names}.\n\nThe AI will:\n• Introduce the role and company\n• Ask about current availability\n• Gauge interest level\n• Schedule follow-up if interested\n\nShall I proceed?`);
    }
    if (chatMode === "priority_review" && outreachCandidates.length > 0 && prevModeRef.current !== "priority_review") {
      const names = outreachCandidates.map((c) => c.name.split(" ")[0]).join(", ");
      addMsg("assistant", `Sending ${outreachCandidates.length > 1 ? `${outreachCandidates.length} candidates` : names} for Priority Review.\n\nThis will:\n• Flag candidate(s) for immediate hiring manager review\n• Send notification to the hiring team\n• Add to priority queue\n\nConfirm to proceed?`);
    }
    if (chatMode === "screenai_call" && outreachCandidates.length > 0 && prevModeRef.current !== "screenai_call") {
      const names = outreachCandidates.map((c) => c.name.split(" ")[0]).join(", ");
      addMsg("assistant", `Scheduling ScreenAI deep-dive call for ${names}.\n\nScreenAI will conduct a detailed technical and cultural fit assessment including:\n• Technical skills validation\n• Role-specific questions\n• Compensation expectations\n• Notice period and availability\n\nWould you like to customize the call script or proceed with default?`);
    }
    if (chatMode === "screening_rules" && prevModeRef.current !== "screening_rules") {
      setNewRuleStep(0);
      setNewRuleData({});
    }
    prevModeRef.current = chatMode;
  }, [chatMode, outreachCandidates, searchStep, addMsg]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    addMsg("user", val);
    setInputValue("");

    // Outreach
    if (chatMode === "outreach" && (outreachStep === "compose" || outreachStep === "confirm")) {
      if (val.toLowerCase().includes("send") || val.toLowerCase().includes("yes") || val.toLowerCase().includes("confirm")) {
        setIsTyping(true);
        setTimeout(() => {
          addMsg("assistant", `Your ${channels.find((c) => c.key === selectedChannel)?.label} message has been queued for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}. They\u2019ll receive it shortly.`);
          setIsTyping(false); resetOutreach(); onModeChange("default");
        }, 1200);
      } else {
        setDraftMessage(val);
        setIsTyping(true);
        setTimeout(() => { addMsg("assistant", "Message updated. Type \"send\" to confirm or keep editing."); setIsTyping(false); setOutreachStep("confirm"); }, 600);
      }
      return;
    }

    // Screening actions (AutoAI, Priority Review, ScreenAI)
    if (chatMode === "autoai_call" || chatMode === "priority_review" || chatMode === "screenai_call") {
      if (val.toLowerCase().includes("yes") || val.toLowerCase().includes("proceed") || val.toLowerCase().includes("confirm")) {
        setIsTyping(true);
        setTimeout(() => {
          if (chatMode === "autoai_call") {
            addMsg("assistant", `AutoAI call initiated for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}.\n\n✓ Call queue updated\n✓ AI script loaded\n✓ Callbacks scheduled\n\nI'll notify you when calls are completed and provide transcripts.`);
          } else if (chatMode === "priority_review") {
            addMsg("assistant", `Priority Review sent for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}.\n\n✓ Hiring manager notified\n✓ Added to priority queue\n✓ Review deadline set for 24 hours\n\nYou'll be notified when feedback is received.`);
          } else if (chatMode === "screenai_call") {
            addMsg("assistant", `ScreenAI deep-dive scheduled for ${outreachCandidates.map(c => c.name.split(" ")[0]).join(", ")}.\n\n✓ Technical assessment configured\n✓ Call slot reserved\n✓ Candidate notified\n\nI'll share the full transcript and assessment after the call.`);
          }
          setIsTyping(false);
          onModeChange("default");
        }, 1500);
      } else if (val.toLowerCase().includes("cancel") || val.toLowerCase().includes("no")) {
        addMsg("assistant", "No problem. Let me know if you need anything else.");
        onModeChange("default");
      } else {
        setIsTyping(true);
        setTimeout(() => { addMsg("assistant", "Say \"yes\" to proceed or \"cancel\" to go back."); setIsTyping(false); }, 500);
      }
      return;
    }

    // Search Q&A
    if (chatMode === "search" && searchStep >= 1 && searchStep <= 3) {
      setSearchAnswers((prev) => ({ ...prev, [searchQuestions[searchStep - 1].key]: val }));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (searchStep < 3) { addMsg("assistant", searchQuestions[searchStep].question); setSearchStep(searchStep + 1); }
        else { addMsg("assistant", searchQuestions[3].question); setSearchStep(4); }
      }, 700);
      return;
    }

    // Rules - new rule Q&A
    if (chatMode === "rules" && newRuleStep >= 1 && newRuleStep <= 3) {
      const key = ruleQuestions[newRuleStep - 1].key;
      setNewRuleData((prev) => ({ ...prev, [key]: val }));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (newRuleStep < 3) {
          addMsg("assistant", ruleQuestions[newRuleStep].question);
          setNewRuleStep(newRuleStep + 1);
        } else {
          const data = { ...newRuleData, [key]: val };
          const label = `When ${data.trigger} \u2192 ${data.action} (${data.channel || "all channels"})`;
          setCurrentRules((prev) => [...prev, { id: `r-${Date.now()}`, label, active: true }]);
          setNewRuleStep(0);
          setNewRuleData({});
          addMsg("assistant", `New rule added:\n\n\u2022 ${label}\n\nRules updated! Say "add rule" to add another or "done" to finish.`);
        }
      }, 700);
      return;
    }

    // Screening Rules - new rule Q&A
    if (chatMode === "screening_rules" && newRuleStep >= 1 && newRuleStep <= 3) {
      const key = screeningRuleQuestions[newRuleStep - 1].key;
      setNewRuleData((prev) => ({ ...prev, [key]: val }));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (newRuleStep < 3) {
          addMsg("assistant", screeningRuleQuestions[newRuleStep].question);
          setNewRuleStep(newRuleStep + 1);
        } else {
          const data = { ...newRuleData, [key]: val };
          const label = `${data.trigger} → ${data.action} (${data.timing || "immediately"})`;
          setScreeningCurrentRules((prev) => [...prev, { id: `scr-r-${Date.now()}`, trigger: data.trigger, action: label, active: true }]);
          setNewRuleStep(0);
          setNewRuleData({});
          addMsg("assistant", `New AutoAI rule added:\n\n✓ ${label}\n\nSay "add rule" to add another or "done" to save.`);
        }
      }, 700);
      return;
    }

    // Rules - commands
    if (chatMode === "rules") {
      if (val.toLowerCase() === "done" || val.toLowerCase() === "save") {
        setIsTyping(true);
        setTimeout(() => {
          addMsg("assistant", `${currentRules.filter((r) => r.active).length} rules are now active. I\u2019ll apply these to all communications and monitor responses automatically.`);
          setIsTyping(false); onModeChange("default");
        }, 700);
      } else if (val.toLowerCase().includes("add")) {
        addMsg("assistant", ruleQuestions[0].question);
        setNewRuleStep(1);
      } else {
        setIsTyping(true);
        setTimeout(() => { addMsg("assistant", "Say \"add rule\" to create a new rule, or \"done\" to save and exit."); setIsTyping(false); }, 500);
      }
      return;
    }

    // Screening Rules - commands
    if (chatMode === "screening_rules") {
      if (val.toLowerCase() === "done" || val.toLowerCase() === "save") {
        setIsTyping(true);
        setTimeout(() => {
          addMsg("assistant", `${screeningCurrentRules.filter((r) => r.active).length} AutoAI rules are now active.\n\nI'll automatically:\n• Initiate calls based on your rules\n• Send follow-ups for no-response\n• Notify you of interested candidates`);
          setIsTyping(false); onModeChange("default");
        }, 700);
      } else if (val.toLowerCase().includes("add")) {
        addMsg("assistant", screeningRuleQuestions[0].question);
        setNewRuleStep(1);
      } else {
        setIsTyping(true);
        setTimeout(() => { addMsg("assistant", "Say \"add rule\" to create a new rule, or \"done\" to save and exit."); setIsTyping(false); }, 500);
      }
      return;
    }

    // Default
    setIsTyping(true);
    setTimeout(() => {
      const responses = isScreening ? [
        "Got it! I'll update the screening workflow accordingly.",
        "Understood. I've noted that for the candidate assessment.",
        "I'll factor that into the screening process. Updates coming shortly.",
      ] : [
        "Got it! I'll refine the candidate search based on your criteria.",
        "Understood. I've updated the sourcing filters accordingly.",
        "I'll factor that into the scoring model. Rankings will update shortly.",
      ];
      addMsg("assistant", responses[Math.floor(Math.random() * responses.length)]);
      setIsTyping(false);
    }, 1000);
  };

  const handleChannelSelect = (ch) => {
    setSelectedChannel(ch);
    addMsg("user", `Via ${channels.find((c) => c.key === ch)?.label}`);
    setIsTyping(true);
    setDraftMessage(generateOutreachMessage(ch, outreachCandidates, jobId));
    setTimeout(() => { addMsg("assistant", "Here\u2019s your draft message. Confirm to send or edit below:"); setOutreachStep("compose"); setIsTyping(false); }, 600);
  };

  const handleConfirmSend = () => {
    setIsTyping(true);
    setTimeout(() => {
      addMsg("assistant", `Your ${channels.find((c) => c.key === selectedChannel)?.label} message has been queued for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}.`);
      setIsTyping(false); resetOutreach(); onModeChange("default");
    }, 1200);
  };

  const handleSourceToggle = (src) => setSelectedSources((prev) => prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]);

  const handleStartSearch = () => {
    const srcLabels = selectedSources.map((s) => sourceOptions.find((o) => o.key === s)?.label).join(", ");
    addMsg("user", `Search on: ${srcLabels}`);
    setIsTyping(true);
    setTimeout(() => {
      const lines = Object.entries(searchAnswers).map(([k, v]) => `\u2022 ${k === "must_have" ? "Must-have" : k === "exclude" ? "Exclude" : "Companies"}: ${v}`).join("\n");
      addMsg("assistant", `Starting refined search:\n\n${lines}\n\u2022 Sources: ${srcLabels}\n\nSearching now\u2026 I\u2019ll update the candidate lists as results come in.`);
      setIsTyping(false); onSearchStart(selectedSources);
      setSearchStep(0); setSearchAnswers({}); setSelectedSources([]); onModeChange("default");
    }, 1000);
  };

  const handleToggleRule = (id) => {
    if (isScreening) {
      setScreeningCurrentRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    } else {
      setCurrentRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
    }
  };

  const handleDeleteRule = (id) => {
    if (isScreening) {
      setScreeningCurrentRules((prev) => prev.filter((r) => r.id !== id));
    } else {
      setCurrentRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleStartAddRule = () => {
    addMsg("user", "Add a new rule");
    if (isScreening) {
      addMsg("assistant", screeningRuleQuestions[0].question);
    } else {
      addMsg("assistant", ruleQuestions[0].question);
    }
    setNewRuleStep(1);
  };

  const resetOutreach = () => { setOutreachStep("channel"); setSelectedChannel(null); setDraftMessage(""); };

  const handleCancelMode = () => {
    resetOutreach(); setSearchStep(0); setSearchAnswers({}); setSelectedSources([]);
    setNewRuleStep(0); setNewRuleData({});
    onModeChange("default");
    addMsg("assistant", "No problem. Let me know if you need anything else.");
  };

  if (!isVisible) {
    return (
      <button data-testid="chat-panel-toggle-open" onClick={onToggle}
        className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors btn-press">
        <MessageSquare className="h-5 w-5" />
      </button>
    );
  }

  const modeLabels = { outreach: "Outreach", search: "Refine Search", rules: "Rules" };

  return (
    <div data-testid="chat-panel" className="w-[380px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>Sourcing Co-pilot</h3>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" /> Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {modeLabels[chatMode] && <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-200">{modeLabels[chatMode]}</Badge>}
          <button data-testid="chat-panel-toggle-close" onClick={onToggle} className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Context */}
      {jobTitle && (
        <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100/50 flex-shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-indigo-600 font-medium">Context: {jobTitle}</p>
          {chatMode !== "default" && <button data-testid="cancel-mode-btn" onClick={handleCancelMode} className="text-[10px] text-slate-400 hover:text-slate-600 underline">Cancel</button>}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-enter flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-[1.6] ${
                msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-indigo-200" : "text-slate-400"}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {/* Outreach: channel buttons */}
          {chatMode === "outreach" && outreachStep === "channel" && !isTyping && (
            <div className="chat-bubble-enter space-y-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <button key={ch.key} data-testid={`chat-channel-${ch.key}`} onClick={() => handleChannelSelect(ch.key)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all hover:shadow-sm ${ch.color}`}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{ch.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Outreach: draft message */}
          {chatMode === "outreach" && outreachStep === "compose" && draftMessage && !isTyping && (
            <div className="chat-bubble-enter">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] ${channels.find((c) => c.key === selectedChannel)?.color}`}>
                    {channels.find((c) => c.key === selectedChannel)?.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {outreachCandidates.slice(0, 3).map((c) => (
                      <Avatar key={c.id} className="h-5 w-5">
                        <AvatarFallback className={`${getAvatarColor(c.name)} text-[7px] font-bold`}>{getInitials(c.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {outreachCandidates.length > 3 && <span className="text-[10px] text-slate-400">+{outreachCandidates.length - 3}</span>}
                  </div>
                </div>
                <pre className="text-[12px] text-slate-600 whitespace-pre-wrap font-sans leading-[1.6] max-h-48 overflow-y-auto">{draftMessage}</pre>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" data-testid="confirm-send-btn" onClick={handleConfirmSend}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5 flex-1">
                    <Send className="h-3 w-3" /> Send to {outreachCandidates.length}
                  </Button>
                  <Button size="sm" variant="outline" data-testid="edit-msg-btn"
                    onClick={() => { setInputValue(draftMessage); setOutreachStep("confirm"); inputRef.current?.focus(); }}
                    className="text-xs">Edit</Button>
                </div>
              </div>
            </div>
          )}

          {/* Search: source selection */}
          {chatMode === "search" && searchStep === 4 && !isTyping && (
            <div className="chat-bubble-enter">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <p className="text-xs font-medium text-slate-600">Select sources:</p>
                {sourceOptions.map((src) => (
                  <button key={src.key} data-testid={`source-option-${src.key}`} onClick={() => handleSourceToggle(src.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      selectedSources.includes(src.key) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}>
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${selectedSources.includes(src.key) ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}>
                      {selectedSources.includes(src.key) && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {src.label}
                  </button>
                ))}
                <Button size="sm" data-testid="start-search-btn" onClick={handleStartSearch} disabled={selectedSources.length === 0}
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5 mt-1">
                  <Sparkles className="h-3 w-3" /> Start Sourcing
                </Button>
              </div>
            </div>
          )}

          {/* Rules: rule cards */}
          {chatMode === "rules" && newRuleStep === 0 && !isTyping && (
            <div className="chat-bubble-enter">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600 mb-1">Active Rules</p>
                {currentRules.map((rule) => (
                  <div key={rule.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${rule.active ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"}`}>
                    <button data-testid={`toggle-rule-${rule.id}`} onClick={() => handleToggleRule(rule.id)}
                      className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${rule.active ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"}`}>
                      {rule.active && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                    <p className={`text-[12px] leading-[1.5] flex-1 ${rule.active ? "text-slate-700" : "text-slate-400 line-through"}`}>{rule.label}</p>
                    <button data-testid={`delete-rule-${rule.id}`} onClick={() => handleDeleteRule(rule.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0 mt-0.5">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" data-testid="add-new-rule-btn" onClick={handleStartAddRule}
                    className="text-xs flex-1 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Pencil className="h-3 w-3" /> Add New Rule
                  </Button>
                  <Button size="sm" data-testid="save-rules-btn"
                    onClick={() => { addMsg("user", "Done"); handleSend(); setInputValue(""); addMsg("assistant", `${currentRules.filter((r) => r.active).length} rules saved. I\u2019ll apply these to all communications automatically.`); onModeChange("default"); }}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5">
                    <Check className="h-3 w-3" /> Save Rules
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Typing */}
          {isTyping && (
            <div className="flex justify-start chat-bubble-enter">
              <div className="bg-slate-100 rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input ref={inputRef} data-testid="chat-input" type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              chatMode === "search" && searchStep >= 1 && searchStep <= 3 ? searchQuestions[searchStep - 1].placeholder
              : chatMode === "rules" && newRuleStep >= 1 ? ruleQuestions[newRuleStep - 1].placeholder
              : chatMode === "outreach" && outreachStep === "confirm" ? "Edit the message and press Enter..."
              : "Ask the co-pilot..."
            }
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none" />
          <Button data-testid="chat-send-button" size="sm" onClick={handleSend} disabled={!inputValue.trim()}
            className="h-7 w-7 p-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
