import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, X, MessageSquare, Mail, MessageCircle, Linkedin, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { initialChatMessages } from "../../data/mockData";
import { jobs, getInitials, getAvatarColor } from "../../data/mockData";

const channels = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "bg-green-50 text-green-700 border-green-200" },
  { key: "email", label: "Email", icon: Mail, color: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "linkedin", label: "LinkedIn InMail", icon: Linkedin, color: "bg-blue-50 text-blue-700 border-blue-200" },
];

const searchQuestions = [
  { key: "must_have", question: "What are the must-have skills you're looking for? Please list the specific technical or domain skills the candidate must possess.", placeholder: "e.g. Go, Kubernetes, 5+ years distributed systems..." },
  { key: "exclude", question: "Are there any skills, traits, or backgrounds you want to exclude from the search?", placeholder: "e.g. No freshers, avoid candidates from consulting firms..." },
  { key: "companies", question: "Any specific companies or company categories you'd like to target?", placeholder: "e.g. FAANG, funded startups, fintech companies..." },
  { key: "sources", question: "Which sources should I search on?", placeholder: "Select sources below" },
];

const sourceOptions = [
  { key: "talentMatch", label: "Internal Database", icon: "db" },
  { key: "syndication", label: "Job Board Profiles", icon: "globe" },
  { key: "autoSourcing", label: "LinkedIn", icon: "linkedin" },
];

const generateOutreachMessage = (channel, candidates, jobId) => {
  const job = jobs.find((j) => j.id === jobId) || jobs[0];
  const name = candidates.length === 1 ? candidates[0].name.split(" ")[0] : "there";
  const link = `https://1recruit.ai/apply/${job.id}`;
  if (channel === "whatsapp") {
    return `Hi ${name},\n\nWe have an exciting opportunity for *${job.title}* at *1Recruit Technologies*.\n\nLocation: ${job.location}\nExperience: ${job.experience}\nCompensation: ${job.salary}\nNotice Period: Immediate to 30 days preferred\n\nApply here: ${link}\n\nBest,\n1Recruit Talent Team`;
  }
  if (channel === "linkedin") {
    return `Hi ${name},\n\nI'm reaching out from 1Recruit Technologies \u2014 we're hiring a ${job.title} for our ${job.location} office.\n\n\u2022 ${job.experience} experience\n\u2022 ${job.salary} compensation\n\u2022 Skills: ${job.skills.slice(0, 3).join(", ")}\n\u2022 Notice Period: Immediate to 30 days\n\nApply: ${link}\n\nBest,\n1Recruit Talent Team`;
  }
  return `Subject: ${job.title} Opportunity at 1Recruit Technologies \u2013 ${job.location}\n\nDear ${name},\n\nI\u2019m reaching out regarding an exciting role of ${job.title} at 1Recruit Technologies, ${job.location}.\n\nRole Highlights:\n\u2022 Department: ${job.department}\n\u2022 Experience: ${job.experience}\n\u2022 Compensation: ${job.salary}\n\u2022 Notice Period: Immediate to 30 days preferred\n\nKey Skills: ${job.skills.join(", ")}\n\nApply here: ${link}\n\nBest regards,\n1Recruit Talent Acquisition`;
};

export const ChatPanel = ({ jobTitle, jobId, isVisible, onToggle, chatMode, outreachCandidates, onModeChange, onSearchStart }) => {
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [searchAnswers, setSearchAnswers] = useState({});
  const [selectedSources, setSelectedSources] = useState([]);
  const [outreachStep, setOutreachStep] = useState("channel");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const addMsg = useCallback((role, content) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role, content, timestamp: now() }]);
  }, []);

  // Handle outreach trigger from parent
  useEffect(() => {
    if (chatMode === "outreach" && outreachCandidates.length > 0 && outreachStep === "channel") {
      const names = outreachCandidates.map((c) => c.name.split(" ")[0]).join(", ");
      addMsg("assistant", `I'll help you reach out to ${outreachCandidates.length > 1 ? `${outreachCandidates.length} candidates: ${names}` : names}. How would you like to contact them?`);
      setOutreachStep("channel");
    }
  }, [chatMode, outreachCandidates, addMsg, outreachStep]);

  // Handle search trigger from parent
  useEffect(() => {
    if (chatMode === "search" && searchStep === 0) {
      addMsg("assistant", "Let\u2019s refine your sourcing criteria. I\u2019ll ask you a few questions to find the best candidates.");
      setTimeout(() => {
        addMsg("assistant", searchQuestions[0].question);
        setSearchStep(1);
      }, 800);
    }
  }, [chatMode, searchStep, addMsg]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMsg("user", inputValue);
    const val = inputValue;
    setInputValue("");

    if (chatMode === "outreach" && outreachStep === "compose") {
      // User modified message - treat as confirmation
      setDraftMessage(val);
      setIsTyping(true);
      setTimeout(() => {
        addMsg("assistant", `Message updated. Ready to send via ${channels.find((c) => c.key === selectedChannel)?.label} to ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}. Type "send" to confirm or keep editing.`);
        setIsTyping(false);
      }, 600);
      return;
    }

    if (chatMode === "outreach" && outreachStep === "confirm") {
      if (val.toLowerCase().includes("send") || val.toLowerCase().includes("yes") || val.toLowerCase().includes("confirm")) {
        setIsTyping(true);
        setTimeout(() => {
          addMsg("assistant", `Done! Your ${channels.find((c) => c.key === selectedChannel)?.label} message has been queued for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}. They\u2019ll receive it shortly.`);
          setIsTyping(false);
          setOutreachStep("channel");
          setSelectedChannel(null);
          setDraftMessage("");
          onModeChange("default");
        }, 1200);
      }
      return;
    }

    if (chatMode === "search") {
      const currentQ = searchStep;
      if (currentQ >= 1 && currentQ <= 3) {
        setSearchAnswers((prev) => ({ ...prev, [searchQuestions[currentQ - 1].key]: val }));
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (currentQ < 3) {
            addMsg("assistant", searchQuestions[currentQ].question);
            setSearchStep(currentQ + 1);
          } else {
            addMsg("assistant", searchQuestions[3].question);
            setSearchStep(4);
          }
        }, 800);
      }
      return;
    }

    // Default mode - freeform chat
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "Got it! I'll refine the candidate search based on your criteria.",
        "Understood. I've updated the sourcing filters accordingly.",
        "I'll factor that into the scoring model. Rankings will update shortly.",
      ];
      addMsg("assistant", responses[Math.floor(Math.random() * responses.length)]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChannelSelect = (ch) => {
    setSelectedChannel(ch);
    addMsg("user", `Via ${channels.find((c) => c.key === ch)?.label}`);
    setIsTyping(true);
    const msg = generateOutreachMessage(ch, outreachCandidates, jobId);
    setDraftMessage(msg);
    setTimeout(() => {
      addMsg("assistant", "Here\u2019s your draft message. You can edit it in the input below, or confirm to send:");
      setOutreachStep("compose");
      setIsTyping(false);
    }, 600);
  };

  const handleConfirmSend = () => {
    setIsTyping(true);
    setTimeout(() => {
      addMsg("assistant", `Done! Your ${channels.find((c) => c.key === selectedChannel)?.label} message has been queued for ${outreachCandidates.length} candidate${outreachCandidates.length > 1 ? "s" : ""}. They\u2019ll receive it shortly.`);
      setIsTyping(false);
      setOutreachStep("channel");
      setSelectedChannel(null);
      setDraftMessage("");
      onModeChange("default");
    }, 1200);
  };

  const handleSourceToggle = (src) => {
    setSelectedSources((prev) => prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]);
  };

  const handleStartSearch = () => {
    const srcLabels = selectedSources.map((s) => sourceOptions.find((o) => o.key === s)?.label).join(", ");
    addMsg("user", `Search on: ${srcLabels}`);
    setIsTyping(true);
    setTimeout(() => {
      const summary = Object.entries(searchAnswers).map(([k, v]) => `\u2022 ${k === "must_have" ? "Must-have" : k === "exclude" ? "Exclude" : "Companies"}: ${v}`).join("\n");
      addMsg("assistant", `Starting a refined search with your criteria:\n${summary}\n\u2022 Sources: ${srcLabels}\n\nSearching now\u2026 I\u2019ll update the candidate lists as results come in.`);
      setIsTyping(false);
      onSearchStart(selectedSources);
      setSearchStep(0);
      setSearchAnswers({});
      setSelectedSources([]);
      onModeChange("default");
    }, 1000);
  };

  const handleCancelMode = () => {
    setOutreachStep("channel");
    setSelectedChannel(null);
    setDraftMessage("");
    setSearchStep(0);
    setSearchAnswers({});
    setSelectedSources([]);
    onModeChange("default");
    addMsg("assistant", "No problem. Let me know if you need anything else.");
  };

  if (!isVisible) {
    return (
      <button
        data-testid="chat-panel-toggle-open"
        onClick={onToggle}
        className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors btn-press"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    );
  }

  const modeLabel = chatMode === "outreach" ? "Outreach" : chatMode === "search" ? "Refine Search" : null;

  return (
    <div data-testid="chat-panel" className="w-[380px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Sourcing Co-pilot
            </h3>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
              Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {modeLabel && (
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-200">
              {modeLabel}
            </Badge>
          )}
          <button data-testid="chat-panel-toggle-close" onClick={onToggle} className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Context banner */}
      {jobTitle && (
        <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100/50 flex-shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-indigo-600 font-medium">Context: {jobTitle}</p>
          {chatMode !== "default" && (
            <button data-testid="cancel-mode-btn" onClick={handleCancelMode} className="text-[10px] text-slate-400 hover:text-slate-600 underline">
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-enter flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-indigo-200" : "text-slate-400"}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {/* Outreach: channel buttons */}
          {chatMode === "outreach" && outreachStep === "channel" && !isTyping && (
            <div className="chat-bubble-enter flex justify-start">
              <div className="w-full space-y-2">
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
            </div>
          )}

          {/* Outreach: draft message preview */}
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
                <pre className="text-[12px] text-slate-600 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">{draftMessage}</pre>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" data-testid="confirm-send-btn" onClick={handleConfirmSend}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5 flex-1">
                    <Send className="h-3 w-3" /> Send to {outreachCandidates.length}
                  </Button>
                  <Button size="sm" variant="outline" data-testid="edit-msg-btn"
                    onClick={() => { setInputValue(draftMessage); setOutreachStep("confirm"); inputRef.current?.focus(); }}
                    className="text-xs">
                    Edit
                  </Button>
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
                      selectedSources.includes(src.key)
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}>
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                      selectedSources.includes(src.key) ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                    }`}>
                      {selectedSources.includes(src.key) && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {src.label}
                  </button>
                ))}
                <Button size="sm" data-testid="start-search-btn" onClick={handleStartSearch}
                  disabled={selectedSources.length === 0}
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 gap-1.5 mt-1">
                  <Sparkles className="h-3 w-3" /> Start Sourcing
                </Button>
              </div>
            </div>
          )}

          {/* Typing indicator */}
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
            placeholder={chatMode === "search" && searchStep >= 1 && searchStep <= 3
              ? searchQuestions[searchStep - 1].placeholder
              : chatMode === "outreach" && outreachStep === "confirm"
              ? "Edit the message and press Enter..."
              : "Ask the co-pilot..."}
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
