import Link from "next/link";
import { Check, Zap, Brain } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background blobs – matches the reference soft purple/blue/orange gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[15%] w-[55%] h-[80%] rounded-full bg-[#dde8ff] blur-[120px] opacity-60" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-[#f0e8ff] blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[60%] rounded-full bg-[#ffe8d6] blur-[120px] opacity-40" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-[1320px] w-full">
        <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-0">
          
          {/* Left — Headline + CTAs */}
          <div className="w-full lg:w-[52%] z-10 lg:pr-10">
            <div className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-[#9333ea] uppercase mb-6">
              AI Content Repurposing
            </div>

            <h1 className="text-[56px] md:text-[72px] font-extrabold leading-[1.03] text-[#0d1117] mb-6 tracking-tight">
              One Input.<br />
              <span className="relative inline-block">
                Ten Outputs.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 380 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  style={{ height: "14px" }}
                >
                  <path
                    d="M4 12 C80 4, 200 4, 376 12"
                    stroke="#3b82f6"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              Zero Repetition.
            </h1>

            <p className="text-[#4b5563] text-[18px] leading-relaxed mb-10 max-w-[500px]">
              Paste a single piece of content and let our AI agents repurpose it into 10+ platform-specific formats. Fast, smart, and tailored for the next generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-3 bg-[#0d1117] text-white px-7 py-4 rounded-2xl hover:bg-[#1f2937] transition-colors shadow-lg text-[15px] font-semibold"
              >
                <Zap className="w-5 h-5 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-400 font-normal -mb-0.5">Start forging now</div>
                  <div>Get ContentForge</div>
                </div>
              </Link>

              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-3 bg-white text-[#0d1117] border border-slate-200 px-7 py-4 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-[15px] font-semibold"
              >
                <Brain className="w-5 h-5 text-[#3b82f6] shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-slate-500 font-normal -mb-0.5">Powered by Groq</div>
                  <div>Train Voice Profile</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-[13px] text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-slate-400" />
                No card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-slate-400" />
                Free to start
              </span>
            </div>
          </div>

          {/* Right — Hero image with floating cards */}
          <div className="relative w-full lg:w-[48%] flex justify-center mt-12 lg:mt-0">
            
            {/* 120K+ badge — top right */}
            <div className="absolute top-4 right-0 lg:right-[-20px] bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex items-center gap-3 z-20 border border-white">
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-[#dbeafe] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#2563eb]">AI</div>
                <div className="w-9 h-9 rounded-full bg-[#ede9fe] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">CF</div>
                <div className="w-9 h-9 rounded-full bg-[#fed7aa] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#c2410c]">+</div>
              </div>
              <div>
                <div className="font-extrabold text-[15px] text-[#0d1117] leading-tight">120K+</div>
                <div className="text-[11px] text-slate-500">Active users</div>
              </div>
            </div>

            {/* Hero image – user will drop hero-boy.png into /public */}
            <div className="relative w-[90%] max-w-[480px] min-h-[420px] lg:min-h-[520px]">
              <img
                src="/hero.avif"
                alt="Content creator using ContentForge AI"
                className="w-full h-full object-cover object-top rounded-3xl"
                style={{ minHeight: "400px" }}
              />
              {/* fallback gradient when image missing */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#dde8ff] via-[#f0e8ff] to-[#ffe8d6] -z-10" />
            </div>

            {/* Time Saved card — bottom left */}
            <div className="absolute bottom-20 -left-4 lg:-left-8 bg-white/96 backdrop-blur-sm p-4 pr-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-20 min-w-[190px] border border-white">
              <div className="text-[12px] font-semibold text-[#0d1117] mb-1">Time Saved</div>
              <div className="text-[#3b82f6] font-extrabold text-[22px] leading-tight">+35,890 hr</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-400 font-medium">1st Jan, 2026</span>
                <span className="text-[11px] font-bold text-[#10b981] flex items-center gap-0.5">
                  3.09% 
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m7 17 9.2-9.2M17 17V7H7"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Gift voucher — bottom right */}
            <div className="absolute -bottom-4 lg:-bottom-2 right-0 lg:-right-4 z-20 overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
              <div className="bg-[#3b82f6] text-white px-5 py-3 text-center">
                <div className="font-extrabold text-[14px] leading-tight">Free 3 Month</div>
                <div className="text-[10px] text-blue-100">on Pro plan</div>
              </div>
              <div className="bg-[#0d1117] text-white text-[10px] font-extrabold uppercase tracking-[0.15em] py-2.5 px-5 text-center">
                Gift Voucher
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
