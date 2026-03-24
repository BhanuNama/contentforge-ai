"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CreditCard, Zap, Check, AlertCircle, Crown, User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to start checkout. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-[#0d1117] tracking-tight mb-1">Settings</h1>
        <p className="text-[#6b7280] text-[15px]">Manage your account, billing, and preferences.</p>
      </div>

      <div className="space-y-5">
        {/* Account */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <User className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <h2 className="font-extrabold text-[#0d1117] text-[16px]">Account</h2>
          </div>
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              <img src={user.imageUrl} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover" />
            )}
            <div className="flex-1">
              <p className="font-extrabold text-[#0d1117] text-[16px]">{user?.fullName || "—"}</p>
              <p className="text-[13px] text-[#6b7280]">{user?.primaryEmailAddress?.emailAddress || "—"}</p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">Free Plan</span>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fffbeb] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <h2 className="font-extrabold text-[#0d1117] text-[16px]">Billing &amp; Plan</h2>
            </div>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">Free Plan</span>
          </div>
          <p className="text-[13px] text-[#6b7280] mb-7 ml-[42px]">Upgrade to Pro for unlimited repurposes and advanced features.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free */}
            <div className="p-6 rounded-[20px] border border-slate-100 bg-[#f9fafb]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-[#0d1117] text-[16px]">Free</h4>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#10b981]">Current</span>
              </div>
              <div className="text-[36px] font-extrabold text-[#0d1117] leading-none mb-5">
                $0 <span className="text-[14px] font-medium text-slate-400">/mo</span>
              </div>
              <ul className="space-y-2.5">
                {["5 repurposes/month", "All 8 platforms", "Brand voice setup", "Content library"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#6b7280] font-medium">
                    <Check className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-[20px] border-2 border-[#3b82f6] bg-[#eff6ff] relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-[#3b82f6] bg-white px-2.5 py-1 rounded-full shadow-sm">
                <Crown className="w-3 h-3" />
                PRO
              </div>
              <h4 className="font-extrabold text-[#0d1117] text-[16px] mb-4">Pro</h4>
              <div className="text-[36px] font-extrabold text-[#0d1117] leading-none mb-5">
                $19 <span className="text-[14px] font-medium text-slate-400">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {["Unlimited repurposes", "Voice learning loop", "Hook A/B testing", "Priority queue", "Export CSV", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#374151] font-medium">
                    <Check className="w-4 h-4 text-[#3b82f6] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-[12px] mb-4">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3.5 rounded-2xl font-bold text-[14px] transition-colors disabled:opacity-50"
              >
                {upgrading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Upgrade to Pro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#faf5ff] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#a855f7]" />
            </div>
            <h2 className="font-extrabold text-[#0d1117] text-[16px]">Notifications</h2>
          </div>
          <div className="space-y-5">
            {[
              { label: "Usage alerts", desc: "Notify when approaching monthly limit" },
              { label: "Forge complete", desc: "Email when a job finishes" },
              { label: "Product updates", desc: "New features and improvements" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#0d1117]">{item.label}</p>
                  <p className="text-[12px] text-[#9ca3af]">{item.desc}</p>
                </div>
                <div className="w-10 h-6 bg-[#3b82f6] rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#10b981]" />
            </div>
            <h2 className="font-extrabold text-[#0d1117] text-[16px]">Security</h2>
          </div>
          <p className="text-[13px] text-[#6b7280] mb-5 leading-relaxed">
            Authentication is managed by Clerk. Visit the Clerk portal to manage passwords, 2FA, and connected accounts.
          </p>
          <button className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-[#0d1117] rounded-2xl font-bold text-[13px] transition-colors">
            Manage Security Settings
          </button>
        </div>
      </div>
    </div>
  );
}
