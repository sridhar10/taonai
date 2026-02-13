import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { getInitials, getAvatarColor, communications } from "../../data/mockData";
import { Mail, MessageCircle, Linkedin, RotateCw, Send, Settings, ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

const channelConfig = {
  email: { icon: Mail, label: "Email", cls: "text-sky-600 bg-sky-50", hoverCls: "hover:bg-sky-100" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", cls: "text-green-600 bg-green-50", hoverCls: "hover:bg-green-100" },
  linkedin: { icon: Linkedin, label: "LinkedIn InMail", cls: "text-violet-600 bg-violet-50", hoverCls: "hover:bg-violet-100" },
};

const statusConfig = {
  replied: { label: "Replied", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Awaiting", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  declined: { label: "Declined", cls: "bg-rose-50 text-rose-600 border-rose-200" },
};

const channelFilterOptions = ["All", "email", "whatsapp", "linkedin"];
const channelFilterLabels = { All: "All Channels", email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn" };
const statusFilterOptions = ["All", "replied", "pending", "declined"];
const statusFilterLabels = { All: "All Status", replied: "Replied", pending: "Awaiting", declined: "Declined" };

export const CommunicationsTable = ({ onResend, onSendNew, onSetRules }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = communications;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => 
        c.candidateName.toLowerCase().includes(q) || 
        c.messageSummary.toLowerCase().includes(q) ||
        c.messageType.toLowerCase().includes(q)
      );
    }
    if (channelFilter !== "All") result = result.filter((c) => c.channel === channelFilter);
    if (statusFilter !== "All") result = result.filter((c) => c.status === statusFilter);
    return result;
  }, [searchQuery, channelFilter, statusFilter]);

  const hasActiveFilters = channelFilter !== "All" || statusFilter !== "All";
  const clearFilters = () => { setChannelFilter("All"); setStatusFilter("All"); setSearchQuery(""); };

  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="communications-section">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex-1 max-w-sm transition-all focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <input 
              data-testid="comm-search-input" 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or message..."
              className="text-sm text-slate-600 placeholder:text-slate-400 bg-transparent outline-none flex-1" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            data-testid="comm-toggle-filters-btn" 
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs h-8 gap-1.5 transition-all ${hasActiveFilters ? "border-indigo-200 text-indigo-600 bg-indigo-50" : ""}`}
          >
            <Filter className="h-3 w-3" /> Filters
            {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            data-testid="set-rules-btn" 
            onClick={onSetRules}
            className="text-xs h-8 gap-1.5 border-slate-300 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <Settings className="h-3 w-3" /> Set Rules
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div 
            data-testid="comm-filters-panel" 
            className="flex items-center gap-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Channel:</span>
              <select 
                data-testid="channel-filter" 
                value={channelFilter} 
                onChange={(e) => setChannelFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300 transition-colors cursor-pointer"
              >
                {channelFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>{channelFilterLabels[opt]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select 
                data-testid="status-filter" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300 transition-colors cursor-pointer"
              >
                {statusFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>{statusFilterLabels[opt]}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button 
                data-testid="comm-clear-filters-btn" 
                onClick={clearFilters} 
                className="text-xs text-indigo-600 hover:underline ml-auto transition-all hover:text-indigo-700"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Message count */}
        <p className="text-xs text-slate-400 mb-3">
          {filtered.length} message{filtered.length !== 1 ? "s" : ""}
          {hasActiveFilters || searchQuery ? " found" : " sent"}
        </p>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "60px" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col />
              <col style={{ width: "10%" }} />
              <col style={{ width: "40px" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left pl-4">Candidate</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Channel</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Type</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Date</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Message</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Status</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-right pr-4"></th>
              </tr>
            </thead>
            {filtered.map((com) => {
              const ch = channelConfig[com.channel] || channelConfig.email;
              const ChIcon = ch.icon;
              const st = statusConfig[com.status] || statusConfig.pending;
              const initials = getInitials(com.candidateName);
              const colorClass = getAvatarColor(com.candidateName);
              const isExpanded = expandedId === com.id;

              return (
                <tbody key={com.id} className="border-b border-slate-50 last:border-b-0">
                  <tr
                    data-testid={`com-row-${com.id}`}
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
                    <td className="py-3 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-all duration-200 ${ch.cls} ${ch.hoverCls}`}>
                            <ChIcon className="h-3.5 w-3.5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{ch.label}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] text-slate-600">{com.messageType}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">{com.dateSent}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{com.messageSummary}</p>
                    </td>
                    <td className="py-3 text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-medium transition-all duration-200 ${st.cls} ${isExpanded ? "scale-105" : ""}`}
                      >
                        {st.label}
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
                  {/* Expanded details with smooth animation */}
                  <tr 
                    data-testid={`com-expanded-${com.id}`}
                    className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}
                  >
                    <td colSpan={7} className="px-4 pb-4 pt-0 bg-indigo-50/20">
                      <div className="ml-10 p-4 bg-white rounded-lg border border-slate-100 shadow-sm animate-fade-in-up space-y-3">
                        {/* Message Sent */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                            <Send className="h-3 w-3" /> Message Sent
                          </p>
                          <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-100">
                            {com.messageSummary}
                          </p>
                        </div>
                        {/* Response */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                            <MessageCircle className="h-3 w-3" /> Response
                          </p>
                          <div className={`p-2.5 rounded-md border ${com.response === "No response yet" 
                            ? "bg-amber-50/50 border-amber-100" 
                            : com.status === "declined" 
                              ? "bg-rose-50/50 border-rose-100" 
                              : "bg-emerald-50/50 border-emerald-100"}`}>
                            <p className={`text-[12px] leading-relaxed ${com.response === "No response yet" ? "text-amber-600 italic" : com.status === "declined" ? "text-rose-600" : "text-emerald-700"}`}>
                              {com.response}
                            </p>
                            {com.responseDate && (
                              <p className="text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-100/50">
                                Responded on: {com.responseDate}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            data-testid={`resend-${com.id}`}
                            onClick={(e) => { e.stopPropagation(); onResend(com); }}
                            className="text-xs h-7 gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all"
                          >
                            <RotateCw className="h-3 w-3" /> Resend
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            data-testid={`send-new-${com.id}`}
                            onClick={(e) => { e.stopPropagation(); onSendNew(com); }}
                            className="text-xs h-7 gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                          >
                            <Send className="h-3 w-3" /> Send New Message
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
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="h-8 w-8 text-slate-300" />
                      <p className="text-sm text-slate-400">No messages match your search</p>
                      <button 
                        onClick={clearFilters} 
                        className="text-xs text-indigo-600 hover:underline mt-1"
                      >
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
