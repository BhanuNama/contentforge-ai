"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#FDFEFE]/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="ContentForge AI Logo" width={36} height={36} className="rounded-xl" />
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
