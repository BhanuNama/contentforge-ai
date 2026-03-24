import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-28 bg-[#f9fafb] scroll-mt-20" id="pricing">
      <div className="container mx-auto px-6 max-w-[1180px]">
        <div className="text-center mb-20">
          <div className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-[#9333ea] uppercase mb-5">
            Pricing
          </div>
          <h2 className="text-[42px] lg:text-[52px] font-extrabold text-[#0d1117] tracking-tight leading-[1.1]">
            Simple transparent pricing<br />no hidden fees
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:items-center">
          {/* Free Plan */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
            <h3 className="font-extrabold text-[#0d1117] text-[22px] mb-2">Free Plan</h3>
            <p className="text-[#6b7280] text-[15px] mb-8">Free for personal use.</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-[58px] font-extrabold text-[#0d1117] leading-none">$0</span>
              <span className="text-[#9ca3af] text-sm font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              {["Up to 5 repurposes per month", "Brand voice setup", "Email support"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-[#374151] font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mt-[1px] shrink-0">
                    <Check className="w-3 h-3 text-[#3b82f6]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center border-2 border-slate-200 hover:border-slate-300 text-[#0d1117] py-3.5 rounded-full font-bold transition-colors text-[15px]"
            >
              Get Free Plan
            </Link>
          </div>

          {/* Advanced Plan (featured) */}
          <div className="bg-[#0d1117] rounded-[32px] p-10 text-white shadow-2xl relative lg:scale-[1.04] z-10">
            <h3 className="font-extrabold text-[22px] mb-2">Advanced</h3>
            <p className="text-slate-400 text-[15px] mb-8">Minimal fees for advanced generations</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-[58px] font-extrabold leading-none">$19</span>
              <span className="text-slate-400 text-sm font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              {[
                "Up to 100 repurposes per month",
                "Advanced brand voice learning",
                "Detailed tone &amp; hook reports",
                "Priority email &amp; chat support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-slate-300 font-medium" dangerouslySetInnerHTML={{ __html: `<div class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-[1px] shrink-0 flex-shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>${item}</span>` }} />
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3.5 rounded-full font-bold transition-colors text-[15px]"
            >
              Get Advanced Plan
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
            <h3 className="font-extrabold text-[#0d1117] text-[22px] mb-2">Business</h3>
            <p className="text-[#6b7280] text-[15px] mb-8">Premium for teams &amp; agencies</p>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-[58px] font-extrabold text-[#0d1117] leading-none">$29</span>
              <span className="text-[#9ca3af] text-sm font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-10">
              {[
                "Unlimited repurposes",
                "Team brand voice profiles",
                "Detailed content reports",
                "Priority email & chat support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-[#374151] font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mt-[1px] shrink-0">
                    <Check className="w-3 h-3 text-[#3b82f6]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center border-2 border-slate-200 hover:border-slate-300 text-[#0d1117] py-3.5 rounded-full font-bold transition-colors text-[15px]"
            >
              Get Business Plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
