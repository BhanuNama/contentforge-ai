import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import { PLATFORM_CONFIG } from "@/lib/utils";
import type { Platform } from "@/lib/utils";
import { BarChart3, TrendingUp, Star, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const db = createServiceClient();
  const { data: user } = await db.from("users").select("id").eq("clerk_id", userId).single();
  if (!user) redirect("/sign-in");

  const { data: results } = await db
    .from("forge_results")
    .select("platform, critic_score, created_at")
    .eq("forge_jobs.user_id", user.id)
    .limit(200);

  const { data: jobs } = await db
    .from("forge_jobs")
    .select("status, platforms, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const platformCounts: Record<string, number> = {};
  const platformScores: Record<string, number[]> = {};

  (results || []).forEach((r) => {
    platformCounts[r.platform] = (platformCounts[r.platform] || 0) + 1;
    if (r.critic_score) {
      platformScores[r.platform] = [...(platformScores[r.platform] || []), r.critic_score];
    }
  });

  const platformStats = Object.entries(platformCounts)
    .map(([platform, count]) => {
      const scores = platformScores[platform] || [];
      const avgScore = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;
      return { platform, count, avgScore };
    })
    .sort((a, b) => b.count - a.count);

  const totalForges = (jobs || []).filter((j) => j.status === "done").length;
  const totalOutputs = results?.length || 0;
  const avgScore = results && results.length > 0
    ? (results.reduce((a, r) => a + (r.critic_score || 0), 0) / results.length).toFixed(1)
    : "—";

  const stats = [
    { label: "Total Forges", value: totalForges, icon: Zap, bg: "#eff6ff", color: "#3b82f6" },
    { label: "Total Outputs", value: totalOutputs, icon: BarChart3, bg: "#f0fdf4", color: "#10b981" },
    { label: "Avg Critic Score", value: avgScore, icon: Star, bg: "#fffbeb", color: "#f59e0b" },
    { label: "Platforms Used", value: Object.keys(platformCounts).length, icon: TrendingUp, bg: "#faf5ff", color: "#a855f7" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-[#0d1117] tracking-tight mb-1">Analytics</h1>
        <p className="text-[#6b7280] text-[15px]">Track your content performance and AI quality metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-[36px] font-extrabold text-[#0d1117] leading-none">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-[28px] border border-slate-100 p-8 shadow-sm">
        <h2 className="font-extrabold text-[#0d1117] text-[18px] mb-7">Platform Usage Breakdown</h2>
        {platformStats.length === 0 ? (
          <div className="text-center py-14">
            <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-[#6b7280] text-[15px]">No data yet. Forge some content to see analytics!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {platformStats.map(({ platform, count, avgScore: score }) => {
              const config = PLATFORM_CONFIG[platform as Platform];
              const maxCount = platformStats[0]?.count || 1;
              const pct = (count / maxCount) * 100;
              return (
                <div key={platform}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: config?.color || "#6366f1" }} />
                      <span className="text-[14px] font-semibold text-[#0d1117]">{config?.name || platform}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[12px] text-slate-400 font-medium">
                      {score && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {score.toFixed(1)}
                        </span>
                      )}
                      <span>{count} outputs</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: config?.color || "#6366f1" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
