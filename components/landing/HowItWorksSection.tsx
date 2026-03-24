import Link from "next/link";
import { Clipboard, Cpu, Share2 } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-28 bg-[#f9fafb] scroll-mt-20">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-[#9333ea] uppercase mb-5">
              How it works
            </div>
            <h2 className="text-[42px] md:text-[52px] font-extrabold text-[#0d1117] tracking-tight leading-[1.1]">
              Repurpose content,<br />in 3 simple steps
            </h2>
          </div>
          <Link
            href="/sign-up"
            className="self-start md:self-end bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3.5 rounded-full text-[15px] font-bold transition-colors shadow-sm whitespace-nowrap"
          >
            Get Started Now
          </Link>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_2px_24px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
          <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Step 1 */}
            <div className="relative p-10 lg:p-12 overflow-hidden">
              <div className="absolute top-3 left-5 text-[160px] font-black text-slate-100 leading-none pointer-events-none select-none tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
                01
              </div>
              <div className="relative z-10 pt-20">
                <div className="w-12 h-12 mb-7 text-[#3b82f6]">
                  <Clipboard className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#0d1117] mb-3 text-[20px]">Paste your content</h3>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">
                  Get ContentForge AI today and drop your blog post or raw thoughts into the generator hassle free.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-10 lg:p-12 overflow-hidden">
              <div className="absolute top-3 left-5 text-[160px] font-black text-slate-100 leading-none pointer-events-none select-none tracking-tighter">
                02
              </div>
              <div className="relative z-10 pt-20">
                <div className="w-12 h-12 mb-7 text-[#14b8a6]">
                  <Cpu className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#0d1117] mb-3 text-[20px]">AI Pipeline Runs</h3>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">
                  Easily connect your ideas in seconds with advanced AI models analyzing context for peace of mind.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-10 lg:p-12 overflow-hidden">
              <div className="absolute top-3 left-5 text-[160px] font-black text-slate-100 leading-none pointer-events-none select-none tracking-tighter">
                03
              </div>
              <div className="relative z-10 pt-20">
                <div className="w-12 h-12 mb-7 text-[#a855f7]">
                  <Share2 className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#0d1117] mb-3 text-[20px]">Publish &amp; Profit</h3>
                <p className="text-[#6b7280] text-[15px] leading-relaxed">
                  Easily split outputs, send content to your audience, and make smooth online posting instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
