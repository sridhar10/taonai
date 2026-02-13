import { useState, useMemo } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { getInitials, getAvatarColor } from "../../data/mockData";
import { 
  Phone, 
  Star, 
  Bot, 
  MoreVertical, 
  Search, 
  Filter, 
  X, 
  Zap, 
  UserCheck,
  Clock
} from "lucide-react";

const transitionConfig = {
  auto: { label: "Auto", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Zap },
  manual: { label: "Manual", cls: "bg-slate-50 text-slate-600 border-slate-200", icon: UserCheck },
};

const statusConfig = {
  pending_call: { label: "Pending Call", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  call_scheduled: { label: "Scheduled", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  call_completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const transitionFilterOptions = ["All", "auto", "manual"];
const transitionFilterLabels = { All: "All Types", auto: "Auto", manual: "Manual" };
const statusFilterOptions = ["All", "pending_call", "call_scheduled", "call_completed"];
const statusFilterLabels = { All: "All Status", pending_call: "Pending Call", call_scheduled: "Scheduled", call_completed: "Completed" };

export const ScreeningCandidatesTable = ({ candidates, onAutoAICall, onPriorityReview, onScreenAICall }) => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [transitionFilter, setTransitionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = candidates;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => 
        c.name.toLowerCase().includes(q) || 
        c.currentRole.toLowerCase().includes(q)
      );
    }
    if (transitionFilter !== "All") result = result.filter((c) => c.transitionType === transitionFilter);
    if (statusFilter !== "All") result = result.filter((c) => c.status === statusFilter);
    return result;
  }, [candidates, searchQuery, transitionFilter, statusFilter]);

  const isAllSelected = filtered.length > 0 && selected.length === filtered.length;
  const toggleAll = () => setSelected(isAllSelected ? [] : filtered.map((c) => c.id));
  const toggleOne = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectedCandidates = candidates.filter((c) => selected.includes(c.id));
  const hasActiveFilters = transitionFilter !== "All" || statusFilter !== "All";
  const clearFilters = () => { setTransitionFilter("All"); setStatusFilter("All"); setSearchQuery(""); };

  const handleBulkAction = (action) => {
    if (action === "autoai") {
      onAutoAICall?.(selectedCandidates);
    } else if (action === "priority") {
      onPriorityReview?.(selectedCandidates);
    }
    setSelected([]);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div data-testid="screening-candidates-section" className="relative">
        {/* Search & Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex-1 max-w-sm transition-all focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <input 
              data-testid="screening-search-input" 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or role..."
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
            data-testid="screening-toggle-filters-btn" 
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs h-8 gap-1.5 transition-all ${hasActiveFilters ? "border-indigo-200 text-indigo-600 bg-indigo-50" : ""}`}
          >
            <Filter className="h-3 w-3" /> Filters
            {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div data-testid="screening-filters-panel" className="flex items-center gap-3 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Transition:</span>
              <select 
                data-testid="transition-filter" 
                value={transitionFilter} 
                onChange={(e) => setTransitionFilter(e.target.value)}
                className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white text-slate-600 outline-none focus:border-indigo-300 transition-colors cursor-pointer"
              >
                {transitionFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>{transitionFilterLabels[opt]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select 
                data-testid="screening-status-filter" 
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
              <button data-testid="screening-clear-filters-btn" onClick={clearFilters} className="text-xs text-indigo-600 hover:underline ml-auto">
                Clear all
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mb-3">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""} in screening</p>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "40px" }} />
              <col style={{ width: "20%" }} />
              <col />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "80px" }} />
            </colgroup>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="pl-4 py-3 text-left">
                  <Checkbox data-testid="select-all-screening" checked={isAllSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Candidate</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-left">Role</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Transition</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Status</th>
                <th className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const initials = getInitials(c.name);
                const colorClass = getAvatarColor(c.name);
                const isSelected = selected.includes(c.id);
                const trans = transitionConfig[c.transitionType] || transitionConfig.manual;
                const TransIcon = trans.icon;
                const st = statusConfig[c.status] || statusConfig.pending_call;

                return (
                  <tr 
                    key={c.id}
                    data-testid={`screening-row-${c.id}`} 
                    className={`group transition-all duration-200 border-b border-slate-50 last:border-b-0
                      ${isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/70"}`}
                  >
                    <td className="pl-4 py-3">
                      <Checkbox 
                        data-testid={`select-screening-${c.id}`} 
                        checked={isSelected} 
                        onCheckedChange={() => toggleOne(c.id)} 
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 flex-shrink-0 transition-transform group-hover:scale-105">
                          <AvatarFallback className={`${colorClass} text-[9px] font-bold`}>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.experience}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-slate-600 truncate">{c.currentRole}</p>
                    </td>
                    <td className="py-3 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${trans.cls}`}>
                            <TransIcon className="h-3 w-3" />
                            {trans.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {c.transitionType === "auto" ? "Automatically moved by AI rules" : "Manually moved by recruiter"}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className={`text-[10px] font-medium ${st.cls}`}>
                        {st.label}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            data-testid={`actions-${c.id}`}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            data-testid={`autoai-call-${c.id}`}
                            onClick={() => onAutoAICall?.([c])}
                            className="gap-2 text-xs"
                          >
                            <Bot className="h-3.5 w-3.5 text-indigo-500" />
                            AutoAI Call
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            data-testid={`priority-review-${c.id}`}
                            onClick={() => onPriorityReview?.([c])}
                            className="gap-2 text-xs"
                          >
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                            Send Priority Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            data-testid={`screenai-call-${c.id}`}
                            onClick={() => onScreenAICall?.([c])}
                            className="gap-2 text-xs"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-500" />
                            ScreenAI Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-8 w-8 text-slate-300" />
                      <p className="text-sm text-slate-400">No candidates match your filters</p>
                      <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline mt-1">
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div data-testid="screening-bulk-action-bar" className="sticky bottom-0 mt-4 flex items-center justify-between px-5 py-3 bg-slate-900 rounded-xl shadow-lg animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                {selected.length}
              </div>
              <span className="text-sm text-slate-300">candidate{selected.length > 1 ? "s" : ""} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                data-testid="bulk-deselect-screening" 
                onClick={() => setSelected([])} 
                className="text-xs text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Deselect
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                data-testid="bulk-autoai-call" 
                onClick={() => handleBulkAction("autoai")} 
                className="text-xs gap-1.5 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                <Bot className="h-3 w-3" /> AutoAI Call
              </Button>
              <Button 
                size="sm" 
                data-testid="bulk-priority-review" 
                onClick={() => handleBulkAction("priority")} 
                className="text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
              >
                <Star className="h-3 w-3" /> Priority Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
