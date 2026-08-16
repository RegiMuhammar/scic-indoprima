"use client";

/**
 * Topbar Navigation Component — SCIC Pitch-Black Design System
 * Features:
 * - Sidebar collapse toggle
 * - Page Title
 * - Live Sync Data notification indicator
 * - "Ask AI Copilot" quick button directly beside user profile
 * - User Profile Avatar & Dropdown Menu
 */

import { usePathname, useRouter } from "next/navigation";
import {
  PanelLeft,
  User,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

interface TopbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Supply Chain & Manufacturing Control Tower",
  "/invoice-matching": "Invoice Matching Intelligence",
  "/demand-intelligence": "Demand & Inventory Decision Intelligence",
  "/chat": "AI Assistant Copilot",
  "/agent-logs": "AI Agent Logs & Audit Trail",
  "/explainability": "AI Explainability Panel",
  "/data-connections": "Data Connections & IoT Health",
  "/settings": "Settings",
};

export function Topbar({ isSidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const router = useRouter();

  const matchedKey = Object.keys(pageTitles).find(
    (key) => pathname === key || pathname.startsWith(key + "/")
  );
  const title = matchedKey ? pageTitles[matchedKey] : "Dashboard";

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out");
    router.refresh();
    router.push("/login");
  };

  const userEmail = user?.email ?? "regimr@gmail.com";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between h-14 px-5 bg-[#000711] border-b border-white/10 shrink-0 select-none font-poppins">
      {/* ── Left: Sidebar Toggle & Page Title ──────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-white/40 hover:text-white transition-colors p-1"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <h1 className="text-white text-xs font-semibold font-poppins tracking-tight">
          {title}
        </h1>
      </div>

      {/* ── Right: Live Sync Dropdown, Ask AI Copilot & User Avatar ───── */}
      <div className="flex items-center gap-3">
        {/* Live Data Sync Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-white/70 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors outline-none cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400">Live Sync</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 bg-[#000711] border border-white/20 rounded-none text-white p-3 shadow-2xl font-poppins"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold">Data Pipeline Active</span>
              </div>
              <span className="text-[10px] text-white/40">Updated 2m ago</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-white/70">
              <div className="flex justify-between">
                <span>SAP S/4HANA ERP:</span>
                <span className="text-emerald-400 font-mono">Synced</span>
              </div>
              <div className="flex justify-between">
                <span>Indoprima WMS:</span>
                <span className="text-emerald-400 font-mono">Stream (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>E-Procurement:</span>
                <span className="text-emerald-400 font-mono">Synced</span>
              </div>
              <div className="flex justify-between">
                <span>IoT SCADA (8 Mesin):</span>
                <span className="text-emerald-400 font-mono">5.040 Pts/day</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Ask AI Copilot Button (Directly beside profile) */}
        <button
          onClick={() => router.push("/chat")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/5 border border-white/20 hover:bg-[#0555E0] hover:border-[#0555E0] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/70" />
          <span>Ask AI Copilot</span>
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-[#0555E0] text-white font-poppins text-xs font-semibold transition-all outline-none border border-white/20 cursor-pointer">
            {userInitial}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#000711] border border-white/20 rounded-none text-white p-1.5 shadow-2xl font-poppins"
          >
            {/* Profile Info Header */}
            <div className="flex items-center gap-3 p-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate font-poppins">
                  {userEmail.split("@")[0]}
                </span>
                <span className="text-[10px] text-white/40 truncate font-poppins">
                  {userEmail}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-white/10 my-1" />

            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins"
            >
              <User className="w-3.5 h-3.5 text-white/60" />
              <span>Account Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins"
            >
              <Settings className="w-3.5 h-3.5 text-white/60" />
              <span>System Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10 my-1" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
