import { DashboardLayout } from "../components/layout/DashboardLayout";
import { JobCard } from "../components/jobs/JobCard";
import { jobs } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Briefcase, Plus, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "../components/ui/button";

export default function JobsListPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1
              className="text-lg font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "Manrope, sans-serif" }}
              data-testid="page-title"
            >
              Active Jobs
            </h1>
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-600 border-indigo-100 text-xs font-semibold"
            >
              {jobs.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              data-testid="filter-button"
              className="text-xs h-8 gap-1.5 text-slate-600"
            >
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-testid="sort-button"
              className="text-xs h-8 gap-1.5 text-slate-600"
            >
              <ArrowUpDown className="h-3 w-3" />
              Sort
            </Button>
            <Button
              size="sm"
              data-testid="new-job-button"
              className="text-xs h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-3 w-3" />
              New Job
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Jobs", value: "5", icon: Briefcase, color: "bg-indigo-50 text-indigo-600" },
              { label: "Total Candidates", value: "217", icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
              { label: "In Pipeline", value: "108", icon: Briefcase, color: "bg-amber-50 text-amber-600" },
              { label: "Offers Sent", value: "9", icon: Briefcase, color: "bg-sky-50 text-sky-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
                className="p-5 bg-white border border-slate-200 rounded-xl"
              >
                <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <Briefcase className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Job Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
