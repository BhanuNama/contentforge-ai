"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#FDFEFE]/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-[#3b82f6]">
             {/* A wave/leaf like logo replacement for Monks Pay logo */}
            <svg width="28" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
              <path d="M10.15 6L21 6v12h-10.85l-4.5-6 4.5-6z" fill="#a855f7" opacity="0.4"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">ContentForge</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Link href="#security" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Security
          </Link>
          <Link href="#testimonial" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Testimonial
          </Link>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 mr-2">
            Sign In
          </Link>
          <Link href="/sign-up" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
