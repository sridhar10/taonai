import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "../ui/table";
import { getInitials, getAvatarColor } from "../../data/mockData";
import { Send, ArrowRight, MessageSquare, Database, Globe, Linkedin, Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";

const getScoreLabel = (score) => {
  if (score >= 90) return { label: "Very High", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 80) return { label: "High", cls: "bg-sky-50 text-sky-700 border-sky-200" };
  if (score >= 70) return { label: "Medium", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Low", cls: "bg-slate-50 text-slate-600 border-slate-200" };
};

const sourceConfig = {
  talent_match: { icon: Database, label: "Talent Match", tip: "Matched from internal talent database", cls: "text-sky-600 bg-sky-50" },
  syndication: { icon: Globe, label: "Syndication", tip: "Applied via job boards (Naukri, Indeed, LinkedIn Jobs)", cls: "text-amber-600 bg-amber-50" },
  linkedin: { icon: Linkedin, label: "LinkedIn", tip: "AI-sourced passive candidate from LinkedIn", cls: "text-violet-600 bg-violet-50" },
};

const scoreFilterOptions = ["All", "Very High", "High", "Medium", "Low"];
const sourceFilterOptions = ["All", "talent_match", "syndication", "linkedin"];
const sourceFilterLabels = { All: "All Sources", talent_match: "Talent Match", syndication: "Syndication", linkedin: "LinkedIn" };

export const CandidateTable = ({ candidates, onSendMessage, onMoveToNext }) => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let result = candidates;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.currentRole.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)));
    }
    if (scoreFilter !== "All") result = result.filter((c) => getScoreLabel(c.matchScore).label === scoreFilter);
    if (sourceFilter !== "All") result = result.filter((c) => c.sourceType === sourceFilter);
    return result;
  }, [candidates, searchQuery, scoreFilter, sourceFilter]);

  const isAllSelected = filtered.length > 0 && selected.length === filtered.length;
  const toggleAll = () => setSelected(isAllSelected ? [] : filtered.map((c) => c.id));
  const toggleOne = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectedCandidates = candidates.filter((c) => selected.includes(c.id));
  const hasActiveFilters = scoreFilter !== "All" || sourceFilter !== "All";
  const clearFilters = () => { setScoreFilter("All"); setSourceFilter("All"); setSearchQuery(""); };

  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="candidate-table-wrapper" className="relative">
        {/* Search & Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex-1 max-w-sm">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <input data-testid="candidate-search-input" type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, or skill..."
              className="text-sm text-slate-600 placeholder:text-slate-400 bg-transparent outline-none flex-1" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600"><X className="h-3 w-3" /></button>}
          </div>
          <Button variant="outline" size="sm" data-testid="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}
            className={`text-xs h-8 gap-1.5 ${hasActiveFilters ? "border-indigo-200 text-indigo-600 bg-indigo-50" : ""}`}>
            <Filter className="h-3 w-3" /> Filters
            {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
          </Button>
        </div>

        {showFilters && (
          <div data-testid="filters-panel" className="flex items-center gap-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Match Score:</span>
              <select data-testid="score-filter" value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300">
                {scoreFilterOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Source:</span>
              <select data-testid="source-filter" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300">
                {sourceFilterOptions.map((opt) => <option key={opt} value={opt}>{sourceFilterLabels[opt]}</option>)}
              </select>
            </div>
            {hasActiveFilters && <button data-testid="clear-filters-btn" onClick={clearFilters} className="text-xs text-indigo-600 hover:underline ml-auto">Clear all</button>}
          </div>
        )}

        <p className="text-xs text-slate-400 mb-3">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</p>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "40px" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "8%" }} />
              <col />
              <col style={{ width: "8%" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="pl-4 py-3 text-left">
                  <Checkbox data-testid="select-all-candidates" checked={isAllSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Candidate</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Current Role</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Exp.</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Source</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Score</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Match Reason</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            {filtered.map((c) => {
                const initials = getInitials(c.name);
                const colorClass = getAvatarColor(c.name);
                const scoreInfo = getScoreLabel(c.matchScore);
                const isSelected = selected.includes(c.id);
                const isExpanded = expandedId === c.id;
                const src = sourceConfig[c.sourceType] || sourceConfig.talent_match;
                const SrcIcon = src.icon;

                return (
                  <tbody key={c.id} className="border-b border-slate-50">
                    <tr data-testid={`candidate-row-${c.id}`} className={`group transition-colors hover:bg-slate-50/50 ${isSelected ? "bg-indigo-50/40" : ""}`}>
                      <td className="pl-4 py-3">
                        <Checkbox data-testid={`select-candidate-${c.id}`} checked={isSelected} onCheckedChange={() => toggleOne(c.id)} />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarFallback className={`${colorClass} text-[9px] font-bold`}>{initials}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-slate-600 truncate">{c.currentRole}</p>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-xs text-slate-600">{c.experience}</span>
                      </td>
                      <td className="py-3 text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div data-testid={`source-icon-${c.id}`} className={`inline-flex items-center justify-center h-7 w-7 rounded-md ${src.cls}`}>
                              <SrcIcon className="h-3.5 w-3.5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs max-w-[200px]">
                            <p className="font-semibold">{src.label}</p>
                            <p className="text-slate-400 mt-0.5">{src.tip}</p>
                            <p className="text-slate-400 mt-0.5">Via: {c.source}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className={`text-[10px] font-medium ${scoreInfo.cls}`}>{scoreInfo.label}</Badge>
                      </td>
                      <td className="py-3">
                        <button
                          data-testid={`expand-reason-${c.id}`}
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                          className="flex items-start gap-1.5 text-left w-full group/reason"
                        >
                          <p className={`text-[11px] text-slate-500 leading-relaxed flex-1 ${isExpanded ? "" : "line-clamp-2"}`}>
                            {c.matchReason}
                          </p>
                          {!isExpanded ? (
                            <ChevronDown className="h-3 w-3 text-slate-300 group-hover/reason:text-slate-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ChevronUp className="h-3 w-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`send-msg-${c.id}`} onClick={() => onSendMessage([c])} className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                <Send className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send Message</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`move-next-${c.id}`} onClick={() => onMoveToNext(c)} className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move to Next Stage</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded match reason */}
                    {isExpanded && (
                      <tr data-testid={`expanded-reason-${c.id}`}>
                        <td colSpan={8} className="px-4 pb-4 pt-0">
                          <div className="ml-10 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-fade-in-up">
                            <p className="text-xs font-medium text-slate-600 mb-1.5">Full Match Analysis</p>
                            <p className="text-[12px] text-slate-500 leading-relaxed">{c.matchReason}</p>
                            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100">
                              <p className="text-[10px] text-slate-400">Skills:</p>
                              <div className="flex gap-1 flex-wrap">
                                {c.skills.map((s) => (
                                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-100">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            {filtered.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <p className="text-sm text-slate-400">No candidates match your filters</p>
                    <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline mt-1">Clear filters</button>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div data-testid="bulk-action-bar" className="sticky bottom-0 mt-4 flex items-center justify-between px-5 py-3 bg-slate-900 rounded-xl shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">{selected.length}</div>
              <span className="text-sm text-slate-300">candidate{selected.length > 1 ? "s" : ""} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" data-testid="bulk-deselect" onClick={() => setSelected([])} className="text-xs text-slate-400 hover:text-white hover:bg-slate-800">Deselect</Button>
              <Button size="sm" data-testid="bulk-send-message" onClick={() => onSendMessage(selectedCandidates)} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                <MessageSquare className="h-3 w-3" /> Send Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
