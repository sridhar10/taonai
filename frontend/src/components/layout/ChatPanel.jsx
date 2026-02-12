import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { initialChatMessages, chatSuggestions } from "../../data/mockData";

export const ChatPanel = ({ jobTitle, isVisible, onToggle }) => {
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Got it! I'll refine the candidate search based on your criteria. Let me re-rank the candidates.",
        "Understood. I've updated the sourcing filters. You should see updated results in the candidate lists.",
        "Thanks for the input. I'm adjusting the matching algorithm to prioritize your preferences.",
        "I'll factor that into the scoring model. The consolidated rankings will reflect this change shortly.",
      ];
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
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

  return (
    <div
      data-testid="chat-panel"
      className="w-[360px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 flex-shrink-0">
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
        <button
          data-testid="chat-panel-toggle-close"
          onClick={onToggle}
          className="h-7 w-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Context banner */}
      {jobTitle && (
        <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100/50 flex-shrink-0">
          <p className="text-[11px] text-indigo-600 font-medium">
            Context: {jobTitle}
          </p>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-enter flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-700 rounded-bl-sm"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
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

      {/* Suggestions */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {chatSuggestions.slice(0, 3).map((s, i) => (
            <button
              key={i}
              data-testid={`chat-suggestion-${i}`}
              onClick={() => handleSuggestionClick(s)}
              className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all whitespace-nowrap"
            >
              {s.length > 40 ? s.slice(0, 40) + "..." : s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            ref={inputRef}
            data-testid="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask the co-pilot..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          <Button
            data-testid="chat-send-button"
            size="sm"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-7 w-7 p-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
