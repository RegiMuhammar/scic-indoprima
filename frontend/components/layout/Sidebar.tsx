"use client";

/**
 * Sidebar Navigation Component
 * Reference-inspired minimalist dark sidebar with Poppins font
 * Supports collapsible (full vs mini icon-only) state
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  TrendingUp,
  Sparkles,
  Settings,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const mainNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invoice Matching",
    href: "/invoice-matching",
    icon: FileCheck2,
  },
  {
    label: "Demand Intelligence",
    href: "/demand-intelligence",
    icon: TrendingUp,
  },
  {
    label: "AI Assistant",
    href: "/chat",
    icon: Sparkles,
  },
];

const secondaryNavItems = [
  {
    label: "Data Connections",
    href: "/data-connections",
    icon: Database,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen bg-[#000711] border-r border-white/10 shrink-0 transition-all duration-300 select-none font-poppins",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold font-poppins tracking-wider uppercase">
              Demo Product SCIC
            </span>
          </div>
        ) : (
          <div className="w-5 h-5 mx-auto rounded-none bg-[#0555E0] flex items-center justify-center text-white font-bold text-xs font-poppins">
            P
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1 text-white/40 hover:text-white transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Nav Items ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-2 py-3 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-xs font-poppins transition-colors rounded-none",
                    isActive
                      ? "bg-[#0555E0] text-white font-semibold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-white/70")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workspace Section */}
        <div>
          {!isCollapsed && (
            <p className="text-white/30 text-[10px] font-poppins font-medium tracking-wider px-3 mb-1.5">
              Workspace
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-xs font-poppins transition-colors rounded-none",
                    isActive
                      ? "bg-[#0555E0] text-white font-semibold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-white/70")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="p-2 border-t border-white/10 space-y-1">
        {!isCollapsed ? (
          <div className="space-y-0.5">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-1.5 text-xs text-white/40 hover:text-white font-poppins transition-colors"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Help Center</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-1.5 text-xs text-white/40 hover:text-white font-poppins transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Documentation</span>
            </a>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center py-2 text-white/40 hover:text-white transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
