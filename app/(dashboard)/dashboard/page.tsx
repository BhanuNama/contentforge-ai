import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Library, Mic2, Zap, TrendingUp, BarChart3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { createServiceClient } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/db/getOrCreateUser";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const db = createServiceClient();

  const { data: recentJobs } = await db
    .from("forge_jobs")
    .select("id, status, platforms, created_at, completed_at")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: voiceProfile } = await db
    .from("voice_profiles")
    .select("profile_json, version")
    .eq("user_id", user?.id || "")
    .single();

  const usagePercent = user ? Math.round((user.repurposes_used / user.repurposes_limit) * 100) : 0;
  const hasVoice = !!voiceProfile;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-[#0d1117] tracking-tight mb-1">
          Welcome back 👋
        </h1>
        <p className="text-[#6b7280] text-[15px]">Ready to forge some content?</p>
      </div>

      {/* Quick forge CTA */}
      <div className="mb-8 bg-[#0d1117] rounded-[28px] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-[#3b82f6]/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[120px] h-full bg-gradient-to-l from-[#a855f7]/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#60a5fa] mb-3">
            Quick Action
          </div>
          <h2 className="text-[22px] font-extrabold text-white mb-2 leading-tight">
            Start forging your content
          </h2>
          <p className="text-slate-400 text-[14px] max-w-md leading-relaxed">
            Paste a blog post, article, or any long-form content and get 10+ formats in 45 seconds.
          </p>
        </div>
        <Link
          href="/forge"
          className="relative z-10 flex items-center gap-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-7 py-3.5 rounded-2xl font-bold text-[15px] transition-colors shadow-lg shrink-0"
        >
          <Sparkles className="w-4.5 h-4.5" />
          Forge Now
          <ArrowRight className="w-4.5 h-4.5" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Usage */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Usage</span>
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#3b82f6]" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#0d1117] leading-none mb-1">
            {user?.repurposes_used || 0}
            <span className="text-[16px] font-medium text-slate-400 ml-1">
              / {user?.plan === "pro" ? "∞" : user?.repurposes_limit || 5}
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3b82f6] rounded-full transition-all" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Plan</span>
            <div className="w-8 h-8 rounded-lg bg-[#fffbeb] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#0d1117] leading-none capitalize mb-1">
            {user?.plan || "free"}
          </div>
          {user?.plan === "free" ? (
            <Link href="/settings" className="text-[12px] text-[#3b82f6] hover:underline font-semibold">
              Upgrade to Pro →
            </Link>
          ) : (
            <span className="text-[12px] text-[#10b981] font-semibold">Unlimited repurposes</span>
          )}
        </div>

        {/* Voice */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Voice</span>
            <div className="w-8 h-8 rounded-lg bg-[#faf5ff] flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-[#a855f7]" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#0d1117] leading-none mb-1">
            {hasVoice ? "Active" : "Setup"}
          </div>
          {hasVoice ? (
            <span className="text-[12px] text-slate-400 font-medium">
              v{voiceProfile?.version} · {(voiceProfile?.profile_json as { corrections_applied?: number })?.corrections_applied || 0} corrections
            </span>
          ) : (
            <Link href="/voice" className="text-[12px] text-[#3b82f6] hover:underline font-semibold">
              Set up now →
            </Link>
          )}
        </div>

        {/* Total */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Total Forges</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#10b981]" />
            </div>
          </div>
          <div className="text-[32px] font-extrabold text-[#0d1117] leading-none mb-1">
            {recentJobs?.filter((j) => j.status === "done").length || 0}
          </div>
          <Link href="/library" className="text-[12px] text-slate-400 hover:text-[#0d1117] font-medium transition-colors">
            View library →
          </Link>
        </div>
      </div>

      {/* Recent Jobs + Checklist */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-[#0d1117] text-[17px]">Recent Jobs</h3>
            <Link href="/library" className="text-[13px] text-[#3b82f6] hover:underline font-semibold">View all</Link>
          </div>

          {!recentJobs || recentJobs.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-slate-100 p-10 text-center">
              <Sparkles className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <p className="text-[#6b7280] text-[15px] mb-4">No jobs yet. Forge your first piece!</p>
              <Link href="/forge" className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors">
                <Sparkles className="w-4 h-4" />
                Start Forging
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/forge?jobId=${job.id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                >
                  <div className="flex-shrink-0">
                    {job.status === "done" && <CheckCircle2 className="w-5 h-5 text-[#10b981]" />}
                    {job.status === "running" && <Clock className="w-5 h-5 text-[#3b82f6] animate-pulse" />}
                    {job.status === "failed" && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {job.status === "pending" && <Clock className="w-5 h-5 text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0d1117] truncate capitalize">
                      {job.platforms.join(", ")}
                    </p>
                    <p className="text-[12px] text-slate-400">{formatRelativeTime(job.created_at)}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize ${
                    job.status === "done" ? "bg-[#f0fdf4] text-[#10b981]" :
                    job.status === "failed" ? "bg-red-50 text-red-500" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {job.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Setup Checklist */}
        <div>
          <h3 className="font-extrabold text-[#0d1117] text-[17px] mb-5">Setup Checklist</h3>
          <div className="bg-white rounded-[20px] border border-slate-100 p-6 space-y-5">
            {[
              { done: true, label: "Create account", desc: "You're in!" },
              { done: hasVoice, label: "Set up voice profile", desc: "Paste 3 writing samples", href: "/voice" },
              { done: (user?.repurposes_used || 0) > 0, label: "Forge first content", desc: "Try a blog post", href: "/forge" },
              { done: user?.plan === "pro", label: "Upgrade to Pro", desc: "Unlimited repurposes", href: "/settings" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3.5">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center border-2 ${
                  item.done ? "bg-[#10b981] border-[#10b981]" : "border-slate-200"
                }`}>
                  {item.done && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-[14px] font-semibold ${item.done ? "line-through text-slate-400" : "text-[#0d1117]"}`}>
                    {item.label}
                  </p>
                  {!item.done && item.href ? (
                    <Link href={item.href} className="text-[12px] text-[#3b82f6] hover:underline font-medium">
                      {item.desc} →
                    </Link>
                  ) : (
                    <p className="text-[12px] text-slate-400">{item.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
