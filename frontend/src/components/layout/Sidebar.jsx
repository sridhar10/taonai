import { useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, Users, Settings, BarChart3, Bot } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", disabled: true },
  { icon: Briefcase, label: "Jobs", path: "/jobs", disabled: false },
  { icon: Users, label: "Candidates", path: "/candidates", disabled: true },
  { icon: BarChart3, label: "Analytics", path: "/analytics", disabled: true },
  { icon: Settings, label: "Settings", path: "/settings", disabled: true },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/jobs") return location.pathname.startsWith("/jobs") || location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <aside
      data-testid="sidebar-nav"
      className="w-60 flex-shrink-0 border-r border-slate-200 bg-white hidden md:flex flex-col"
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            SourceRank
          </span>
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium -mt-0.5">
            AI Orchestrator
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                onClick={() => !item.disabled && navigate(item.path)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 btn-press relative
                  ${active
                    ? "bg-indigo-50 text-indigo-700 nav-link-active"
                    : item.disabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {item.disabled && (
                  <span className="ml-auto text-[10px] text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
            HR
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">HR Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
