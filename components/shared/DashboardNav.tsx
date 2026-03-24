"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import {
  Zap, LayoutDashboard, Sparkles, Library, Mic2, Settings,
  BarChart3, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/forge", icon: Sparkles, label: "Forge Content" },
  { href: "/library", icon: Library, label: "Content Library" },
  { href: "/voice", icon: Mic2, label: "Voice Profile" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const handleSignOut = () => signOut({ redirectUrl: "/" });

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white border-r border-slate-100 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="ContentForge AI" width={36} height={36} className="rounded-xl" />
            <div>
              <span className="font-extrabold text-[15px] text-[#0d1117] tracking-tight">ContentForge</span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-0.5">AI Platform</span>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all",
                  isActive
                    ? "bg-[#eff6ff] text-[#3b82f6]"
                    : "text-[#6b7280] hover:text-[#0d1117] hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive ? "text-[#3b82f6]" : "text-[#9ca3af]")} />
                <span>{item.label}</span>
                {item.href === "/forge" && (
                  <span className="ml-auto text-[10px] bg-[#3b82f6] text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Row */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#0d1117] truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Account"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.emailAddresses[0]?.emailAddress || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-white border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="ContentForge AI" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-[#0d1117]">ContentForge</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleSignOut} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
          <UserButton />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around px-2 h-16 bg-white border-t border-slate-100">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive ? "text-[#3b82f6]" : "text-slate-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
