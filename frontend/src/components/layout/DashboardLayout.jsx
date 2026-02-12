import { useState } from "react";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children, chatPanel }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div data-testid="dashboard-layout" className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      {chatPanel}
    </div>
  );
};
