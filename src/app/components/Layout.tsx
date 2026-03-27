import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Layers,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/study", label: "Study Cards", icon: BookOpen },
  { to: "/quiz", label: "Quiz Mode", icon: Brain },
  { to: "/results", label: "Results", icon: BarChart3 },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 ease-in-out shrink-0"
        style={{
          width: collapsed ? "72px" : "240px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 40, height: 40, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Layers size={20} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-semibold text-sm tracking-wide">VocabVision</div>
              <div className="text-slate-400 text-xs">Image-Based Learning</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {!collapsed && (
            <div className="px-3 pb-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest">Navigation</span>
            </div>
          )}
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={() =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white"}`}
                />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                )}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-4 border-t border-white/10 pt-4">
          {!collapsed && (
            <div className="px-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={14} className="text-indigo-400" />
                <span className="text-xs text-slate-300 font-medium">HCI Project 2026</span>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                Dual Coding Theory Study
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
