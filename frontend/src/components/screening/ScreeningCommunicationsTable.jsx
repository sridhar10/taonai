import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { getInitials, getAvatarColor } from "../../data/mockData";
import { 
  Bot, 
  Star, 
  Phone, 
  Search, 
  Filter, 
  X, 
  Settings,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare
} from "lucide-react";

const modeConfig = {
  autoai_call: { icon: Bot, label: "AutoAI Call", cls: "text-indigo-600 bg-indigo-50", hoverCls: "hover:bg-indigo-100" },
  priority_review: { icon: Star, label: "Priority Review", cls: "text-amber-600 bg-amber-50", hoverCls: "hover:bg-amber-100" },
  screenai_call: { icon: Phone, label: "ScreenAI Call", cls: "text-emerald-600 bg-emerald-50", hoverCls: "hover:bg-emerald-100" },
};

const outcomeConfig = {
  showed_interest: { label: "Showed Interest", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  no_response: { label: "No Response", cls: "bg-rose-50 text-rose-600 border-rose-200", icon: XCircle },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
};

const modeFilterOptions = ["All", "autoai_call", "priority_review", "screenai_call"];
const modeFilterLabels = { All: "All Modes", autoai_call: "AutoAI Call", priority_review: "Priority Review", screenai_call: "ScreenAI Call" };
const outcomeFilterOptions = ["All", "showed_interest", "no_response", "pending"];
const outcomeFilterLabels = { All: "All Outcomes", showed_interest: "Showed Interest", no_response: "No Response", pending: "Pending" };

export const ScreeningCommunicationsTable = ({ communications, onSetRules }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = communications;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => 
        c.candidateName.toLowerCase().includes(q) || 
        c.currentRole.toLowerCase().includes(q) ||
        c.transcript.toLowerCase().includes(q)
      );
    }
    if (modeFilter !== "All") result = result.filter((c) => c.mode === modeFilter);
    if (outcomeFilter !== "All") result = result.filter((c) => c.outcome === outcomeFilter);
    return result;
  }, [communications, searchQuery, modeFilter, outcomeFilter]);

  const hasActiveFilters = modeFilter !== "All" || outcomeFilter !== "All";
  const clearFilters = () => { setModeFilter("All"); setOutcomeFilter("All"); setSearchQuery(""); };

  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="screening-communications-section">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex-1 max-w-sm transition-all focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <input 
              data-testid="screening-comm-search-input" 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, or transcript..."
              className="text-sm text-slate-600 placeholder:text-slate-400 bg-transparent outline-none flex-1" 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            data-testid="screening-comm-toggle-filters-btn" 
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs h-8 gap-1.5 transition-all ${hasActiveFilters ? "border-indigo-200 text-indigo-600 bg-indigo-50" : ""}`}
          >
            <Filter className="h-3 w-3" /> Filters
            {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            data-testid="screening-set-rules-btn" 
            onClick={onSetRules}
            className="text-xs h-8 gap-1.5 border-slate-300 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <Settings className="h-3 w-3" /> Set Rules
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div data-testid="screening-comm-filters-panel" className="flex items-center gap-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Mode:</span>
              <select 
                data-testid="mode-filter" 
                value={modeFilter} 
                onChange={(e) => setModeFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300 transition-colors cursor-pointer"
              >
                {modeFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>{modeFilterLabels[opt]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Outcome:</span>
              <select 
                data-testid="outcome-filter" 
                value={outcomeFilter} 
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300 transition-colors cursor-pointer"
              >
                {outcomeFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>{outcomeFilterLabels[opt]}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button data-testid="screening-comm-clear-filters-btn" onClick={clearFilters} className="text-xs text-indigo-600 hover:underline ml-auto">
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Communication count */}
        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} communication{filtered.length !== 1 ? "s" : ""}
          {hasActiveFilters || searchQuery ? " found" : " recorded"}
        </p>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "18%" }} />
              <col />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "40px" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left pl-4">Candidate</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Role</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Mode</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Call Time</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Outcome</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-right pr-4"></th>
              </tr>
            </thead>
            {filtered.map((com) => {
              const mode = modeConfig[com.mode] || modeConfig.autoai_call;
              const ModeIcon = mode.icon;
              const outcome = outcomeConfig[com.outcome] || outcomeConfig.pending;
              const OutcomeIcon = outcome.icon;
              const initials = getInitials(com.candidateName);
              const colorClass = getAvatarColor(com.candidateName);
              const isExpanded = expandedId === com.id;

              return (
                <tbody key={com.id} className="border-b border-slate-50 last:border-b-0">
                  <tr
                    data-testid={`screening-com-row-${com.id}`}
                    className={`group transition-all duration-200 cursor-pointer
                      ${isExpanded 
                        ? "bg-indigo-50/40 border-l-2 border-l-indigo-400" 
                        : "hover:bg-slate-50/70 border-l-2 border-l-transparent hover:border-l-slate-200"
                      }`}
                    onClick={() => setExpandedId(isExpanded ? null : com.id)}
                  >
                    <td className="pl-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className={`h-7 w-7 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "scale-105" : "group-hover:scale-105"}`}>
                          <AvatarFallback className={`${colorClass} text-[9px] font-bold`}>{initials}</AvatarFallback>
                        </Avatar>
                        <p className={`text-sm font-medium truncate transition-colors ${isExpanded ? "text-indigo-900" : "text-slate-900"}`}>
                          {com.candidateName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-[11px] text-slate-600 truncate">{com.currentRole}</p>
                    </td>
                    <td className="py-3 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-all duration-200 ${mode.cls} ${mode.hoverCls}`}>
                            <ModeIcon className="h-3.5 w-3.5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{mode.label}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="py-3">
                      <div className="text-[11px] text-slate-500">
                        <p className="whitespace-nowrap">{com.callTime.split(" ").slice(0, 1).join(" ")}</p>
                        <p className="text-slate-400">{com.callTime.split(" ").slice(1).join(" ")}</p>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-medium gap-1 transition-all duration-200 ${outcome.cls} ${isExpanded ? "scale-105" : ""}`}
                      >
                        <OutcomeIcon className="h-3 w-3" />
                        {outcome.label}
                      </Badge>
                    </td>
                    <td className="py-3 text-right pr-4">
                      <div className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        {isExpanded
                          ? <ChevronUp className="h-3.5 w-3.5 text-indigo-500 inline" />
                          : <ChevronDown className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 inline transition-colors" />}
                      </div>
                    </td>
                  </tr>
                  {/* Expanded transcript */}
                  <tr 
                    data-testid={`screening-com-expanded-${com.id}`}
                    className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
                  >
                    <td colSpan={6} className="px-4 pb-4 pt-0 bg-indigo-50/20">
                      <div className="ml-10 p-4 bg-white rounded-lg border border-slate-100 shadow-sm animate-fade-in-up space-y-3">
                        {/* Call Summary */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] gap-1 ${mode.cls}`}>
                              <ModeIcon className="h-3 w-3" />
                              {mode.label}
                            </Badge>
                            {com.duration !== "N/A" && (
                              <span className="text-[10px] text-slate-400">Duration: {com.duration}</span>
                            )}
                          </div>
                          <Badge variant="outline" className={`text-[10px] gap-1 ${outcome.cls}`}>
                            <OutcomeIcon className="h-3 w-3" />
                            {outcome.label}
                          </Badge>
                        </div>
                        
                        {/* Transcript */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                            <FileText className="h-3 w-3" /> Transcript / Notes
                          </p>
                          <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
                            <p className="text-[12px] text-slate-600 leading-relaxed">{com.transcript}</p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {com.outcome === "no_response" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                              <Bot className="h-3 w-3" /> Retry Call
                            </Button>
                          )}
                          {com.outcome === "showed_interest" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            >
                              <Phone className="h-3 w-3" /> Schedule ScreenAI
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50"
                          >
                            <MessageSquare className="h-3 w-3" /> Add Note
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
            {/* Empty state */}
            {filtered.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Phone className="h-8 w-8 text-slate-300" />
                      <p className="text-sm text-slate-400">No communications match your search</p>
                      <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline mt-1">
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};
