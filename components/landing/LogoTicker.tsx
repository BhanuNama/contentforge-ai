export function LogoTicker() {
  const logos = [
    { name: "Loopify", icon: "◉" },
    { name: "Brandr", icon: "◎" },
    { name: "Scribe", icon: "△" },
    { name: "Luminate.co", icon: "≡" },
    { name: "flowworks", icon: "✦" },
    { name: "Notion+", icon: "░" },
  ];

  return (
    <section className="py-14 border-t border-slate-100 bg-white">
      <p className="text-center text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-8">
        Trusted by leading content teams
      </p>
      <div className="flex flex-wrap justify-center gap-10 items-center px-6 opacity-[0.28] grayscale select-none">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center gap-2.5 text-[18px] font-bold text-slate-700">
            <span className="text-[22px]">{logo.icon}</span>
            {logo.name}
          </div>
        ))}
      </div>
    </section>
  );
}
