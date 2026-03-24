import Link from "next/link";
import { Zap, Brain, Clipboard, Shield } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-28 bg-white scroll-mt-20" id="features">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center mb-20">
          <div className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-[#9333ea] uppercase mb-5">
            Features
          </div>
          <h2 className="text-[42px] md:text-[52px] font-extrabold text-[#0d1117] tracking-tight leading-[1.1]">
            Why choose ContentForge for<br />effortless repurposing?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-[#eff6ff] p-8 rounded-[28px] flex flex-col">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Zap className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <h3 className="font-bold text-[#0d1117] mb-3 text-[17px] leading-snug">5-Agent Pipeline</h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              Orchestrator → Analyst → Specialists. Send content to agents operating in parallel.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fff7ed] p-8 rounded-[28px] flex flex-col">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Brain className="w-7 h-7 text-[#f97316]" />
            </div>
            <h3 className="font-bold text-[#0d1117] mb-3 text-[17px] leading-snug">Brand Voice Memory</h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              Clear and simple tone matching. Always be aware of your style and personality.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f0fdf4] p-8 rounded-[28px] flex flex-col">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Clipboard className="w-7 h-7 text-[#14b8a6]" />
            </div>
            <h3 className="font-bold text-[#0d1117] mb-3 text-[17px] leading-snug">10+ Formats in 45s</h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              Store your content securely and make fast transfers across 8 platforms seamlessly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#faf5ff] p-8 rounded-[28px] flex flex-col">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Shield className="w-7 h-7 text-[#a855f7]" />
            </div>
            <h3 className="font-bold text-[#0d1117] mb-3 text-[17px] leading-snug">Quality Critic Gate</h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              End-to-end evaluation for all outputs. The AI reviews itself before showing you results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
