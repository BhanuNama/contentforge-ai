export function SecuritySection() {
  return (
    <section className="py-28 bg-white scroll-mt-20" id="security">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">
          <div className="flex-1 max-w-[480px]">
            <div className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-[#9333ea] uppercase mb-5">
              Security
            </div>
            <h2 className="text-[42px] lg:text-[50px] font-extrabold text-[#0d1117] tracking-tight leading-[1.1]">
              We protect your content at every step with ContentForge
            </h2>
          </div>
          <div className="flex-1 lg:pt-16">
            <p className="text-[#6b7280] text-[17px] leading-relaxed max-w-[480px]">
              ContentForge ensures your content is protected at every step with advanced AI critics, real-time voice matching, and multi-agent quality gates.
            </p>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-[40px] p-10 md:p-14 border border-slate-100">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            <div>
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">Orchestrator pattern</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">ReAct orchestration ensures added protection by using verification steps before every generation begins.</p>
            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-[#0ea5e9] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">Brand Voice access</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">Easily and securely generate with your voice print features through your digital style model.</p>
            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-[#ef4444] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">Hallucination detection</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">Fraud detection safeguards your facts, sending instant alerts for any fabricated claims or false data.</p>
            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-[#f59e0b] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">End-to-end evaluation</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">By automated critic, protecting your posts from unauthorized formatting or poor structure.</p>
            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-[#10b981] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">Platform specialists</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">Instant agent notifications keep you informed and help manage your content for every platform.</p>
            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-[#a855f7] mb-5" />
              <h3 className="font-bold text-[#0d1117] mb-3 text-[17px]">24/7 Quality support</h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed">Our dedicated AI agents are available around the clock to help you rewrite, adapt, and improve.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
