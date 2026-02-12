import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Users, Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";

export const JobCard = ({ job, index }) => {
  const navigate = useNavigate();

  const totalPipeline = Object.values(job.pipeline).reduce((a, b) => a + b, 0);

  return (
    <div
      data-testid={`job-card-${job.id}`}
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="group relative flex flex-col p-6 bg-white border border-slate-200 rounded-xl card-hover cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-medium hover:bg-emerald-50"
              variant="outline"
            >
              {job.status}
            </Badge>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              {job.department}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {job.title}
          </h3>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {job.experience}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5" />
            {totalPipeline} in pipeline
          </span>
          <span className="text-xs text-slate-400">
            {job.openings} openings
          </span>
        </div>
        <span className="text-xs font-medium text-slate-400">
          {job.salary}
        </span>
      </div>
    </div>
  );
};
