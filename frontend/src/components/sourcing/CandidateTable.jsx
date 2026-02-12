import { useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "../ui/table";
import { getInitials, getAvatarColor } from "../../data/mockData";
import { Send, ArrowRight, MessageSquare } from "lucide-react";

const getScoreLabel = (score) => {
  if (score >= 90) return { label: "Very High", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 80) return { label: "High", class: "bg-sky-50 text-sky-700 border-sky-200" };
  if (score >= 70) return { label: "Medium", class: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Low", class: "bg-slate-50 text-slate-600 border-slate-200" };
};

export const CandidateTable = ({ candidates, onSendMessage, onMoveToNext }) => {
  const [selected, setSelected] = useState([]);

  const isAllSelected = candidates.length > 0 && selected.length === candidates.length;
  const isSomeSelected = selected.length > 0 && selected.length < candidates.length;

  const toggleAll = () => {
    setSelected(isAllSelected ? [] : candidates.map((c) => c.id));
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedCandidates = candidates.filter((c) => selected.includes(c.id));

  return (
    <div data-testid="candidate-table-wrapper" className="relative">
      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  data-testid="select-all-candidates"
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  className={isSomeSelected ? "data-[state=checked]:bg-indigo-600" : ""}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Candidate
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Role
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                Experience
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                Match Score
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => {
              const initials = getInitials(candidate.name);
              const colorClass = getAvatarColor(candidate.name);
              const scoreInfo = getScoreLabel(candidate.matchScore);
              const isSelected = selected.includes(candidate.id);

              return (
                <TableRow
                  key={candidate.id}
                  data-testid={`candidate-row-${candidate.id}`}
                  className={`group transition-colors ${isSelected ? "bg-indigo-50/40" : ""}`}
                >
                  <TableCell className="pl-4">
                    <Checkbox
                      data-testid={`select-candidate-${candidate.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(candidate.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${colorClass} text-[10px] font-bold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{candidate.name}</p>
                        <p className="text-[11px] text-slate-400">{candidate.source}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 truncate max-w-[200px]">{candidate.currentRole}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-slate-600">{candidate.experience}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-medium ${scoreInfo.class}`}
                    >
                      {scoreInfo.label} ({candidate.matchScore}%)
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`send-msg-${candidate.id}`}
                        onClick={() => onSendMessage([candidate])}
                        className="h-7 px-2 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`move-next-${candidate.id}`}
                        onClick={() => onMoveToNext(candidate)}
                        className="h-7 px-2 text-xs text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Next Stage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Floating action bar when candidates are selected */}
      {selected.length > 0 && (
        <div
          data-testid="bulk-action-bar"
          className="sticky bottom-0 mt-4 flex items-center justify-between px-5 py-3 bg-slate-900 rounded-xl shadow-lg animate-fade-in-up"
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              {selected.length}
            </div>
            <span className="text-sm text-slate-300">
              candidate{selected.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              data-testid="bulk-deselect"
              onClick={() => setSelected([])}
              className="text-xs text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Deselect
            </Button>
            <Button
              size="sm"
              data-testid="bulk-send-message"
              onClick={() => onSendMessage(selectedCandidates)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <MessageSquare className="h-3 w-3" />
              Send Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
