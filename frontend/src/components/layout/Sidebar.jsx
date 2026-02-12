import { useLocation, useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, Users, Settings, BarChart3, PanelLeftClose, PanelLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_source-rank-flow/artifacts/6vldwfcn_1recruit-circle-870e8564.svg";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", disabled: true },
  { icon: Briefcase, label: "Jobs", path: "/jobs", disabled: false },
  { icon: Users, label: "Candidates", path: "/candidates", disabled: true },
  { icon: BarChart3, label: "Analytics", path: "/analytics", disabled: true },
  { icon: Settings, label: "Settings", path: "/settings", disabled: true },
];

export const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/jobs") return location.pathname.startsWith("/jobs") || location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        data-testid="sidebar-nav"
        className={`
          flex-shrink-0 border-r border-slate-200 bg-white hidden md:flex flex-col
          transition-all duration-250 ease-in-out
          ${collapsed ? "w-[68px]" : "w-60"}
        `}
      >
        {/* Brand */}
        <div className={`h-16 flex items-center border-b border-slate-100 ${collapsed ? "justify-center px-3" : "gap-3 px-5"}`}>
          <img
            src={LOGO_URL}
            alt="1Recruit"
            className="h-8 w-8 rounded-lg flex-shrink-0 object-contain"
          />
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight block" style={{ fontFamily: 'Manrope, sans-serif' }}>
                1Recruit
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-medium -mt-0.5">
                AI Orchestrator
              </span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <div className={`px-3 pt-3 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            data-testid="sidebar-toggle"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors btn-press text-slate-400 hover:text-slate-600"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              const btn = (
                <button
                  key={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center rounded-lg text-sm font-medium
                    transition-all duration-150 btn-press relative
                    ${collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"}
                    ${active
                      ? "bg-indigo-50 text-indigo-700 nav-link-active"
                      : item.disabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && item.label}
                  {!collapsed && item.disabled && (
                    <span className="ml-auto text-[10px] text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </button>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return btn;
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"}`}>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
              HR
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">HR Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@company.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};
