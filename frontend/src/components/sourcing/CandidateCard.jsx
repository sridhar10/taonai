import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getInitials, getAvatarColor } from "../../data/mockData";
import { ExternalLink, Star } from "lucide-react";

export const CandidateCard = ({ candidate, rank }) => {
  const initials = getInitials(candidate.name);
  const colorClass = getAvatarColor(candidate.name);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 80) return "text-sky-700 bg-sky-50 border-sky-200";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getStatusColor = (status) => {
    if (status === "Available" || status === "Open to work") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Active applicant") return "bg-sky-50 text-sky-700 border-sky-200";
    if (status === "Open to opportunities" || status === "Passively looking") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div
      data-testid={`candidate-card-${candidate.id}`}
      className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-lg hover:border-indigo-100 hover:shadow-sm transition-all group"
    >
      {/* Rank */}
      {rank && (
        <div className="flex-shrink-0 w-6 text-center">
          <span className={`text-xs font-bold ${rank <= 3 ? "text-indigo-600" : "text-slate-400"}`}>
            #{rank}
          </span>
        </div>
      )}

      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className={`${colorClass} text-xs font-bold`}>
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-medium text-slate-900 truncate">{candidate.name}</h4>
          {candidate.matchScore >= 90 && (
            <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-500 truncate">{candidate.currentRole}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-slate-400">{candidate.experience}</span>
          <span className="text-slate-200">|</span>
          <span className="text-[10px] text-slate-400">{candidate.source}</span>
          <span className="text-slate-200">|</span>
          <span className="text-[10px] text-slate-400">{candidate.lastActive}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Score + Status */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className={`text-xs font-bold px-2 py-1 rounded-md border ${getScoreColor(candidate.matchScore)}`}>
          {candidate.matchScore}%
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-medium whitespace-nowrap ${getStatusColor(candidate.status)}`}
        >
          {candidate.status}
        </Badge>
        <button
          data-testid={`view-profile-${candidate.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <ExternalLink className="h-2.5 w-2.5" />
          View
        </button>
      </div>
    </div>
  );
};
