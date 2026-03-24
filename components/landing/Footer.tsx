import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white py-8 border-t border-slate-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <div className="w-6 h-6 rounded bg-[#3b82f6] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          ContentForge AI
        </div>
        <div className="text-sm text-slate-500">© 2026 ContentForge AI. Built with Groq.</div>
      </div>
    </footer>
  );
}
