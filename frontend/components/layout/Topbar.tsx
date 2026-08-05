"use client";

/**
 * Topbar Navigation Component
 * Reference-inspired dark minimal topbar with white initial avatar and exact dropdown structure
 */

import { usePathname } from "next/navigation";
import {
  Bell,
  Send,
  PanelLeft,
  User,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TopbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/invoice-matching": "Invoice Matching",
  "/demand-intelligence": "Demand Intelligence",
  "/chat": "AI Assistant",
  "/data-connections": "Data Connections",
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
    window.location.href = "/login";
  };

  const userEmail = user?.email ?? "shaban@efferd.com";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between h-14 px-5 bg-[#000000] border-b border-white/10 shrink-0 select-none font-poppins">
      {/* ── Left: Sidebar Toggle & Page Title ──────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-white/40 hover:text-white transition-colors p-1"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <h1 className="text-white text-xs font-medium font-poppins tracking-tight">
          {title}
        </h1>
      </div>

      {/* ── Right: Utilities & User Avatar ──────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Send / Paperplane icon */}
        <button className="text-white/40 hover:text-white transition-colors p-1">
          <Send className="w-4 h-4" />
        </button>

        {/* Bell notification icon */}
        <button className="text-white/40 hover:text-white transition-colors p-1 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-poppins text-xs font-semibold transition-all outline-none border border-white/20 cursor-pointer">
            {userInitial}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#121212] border border-white/10 rounded-none text-white p-1.5 shadow-2xl font-poppins"
          >
            {/* Profile Info Header matching reference */}
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

            <DropdownMenuItem className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins">
              <User className="w-3.5 h-3.5 text-white/60" />
              <span>Account</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins">
              <Settings className="w-3.5 h-3.5 text-white/60" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-none px-2.5 py-1.5 cursor-pointer font-poppins">
              <CreditCard className="w-3.5 h-3.5 text-white/60" />
              <span>Plan & Billing</span>
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
