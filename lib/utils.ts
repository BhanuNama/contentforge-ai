import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxAttempts) {
        await sleep(baseDelay * attempt);
      }
    }
  }
  throw lastError;
}

export const PLATFORM_CONFIG = {
  twitter: {
    name: "Twitter / X",
    icon: "Twitter",
    color: "#1DA1F2",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    borderColor: "border-sky-200 dark:border-sky-800",
    charLimit: 280,
    description: "Thread-optimized with hooks",
  },
  linkedin: {
    name: "LinkedIn",
    icon: "Linkedin",
    color: "#0A66C2",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    charLimit: 3000,
    description: "Professional story format",
  },
  youtube: {
    name: "YouTube",
    icon: "Youtube",
    color: "#FF0000",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    charLimit: 5000,
    description: "Title, description & timestamps",
  },
  email: {
    name: "Email Newsletter",
    icon: "Mail",
    color: "#6366f1",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    charLimit: 10000,
    description: "Subject + body with A/B variants",
  },
  instagram: {
    name: "Instagram",
    icon: "Instagram",
    color: "#E1306C",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    charLimit: 2200,
    description: "Caption with hashtag strategy",
  },
  tiktok: {
    name: "TikTok Script",
    icon: "Music",
    color: "#010101",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800",
    charLimit: 2000,
    description: "Hook-first video script",
  },
  newsletter: {
    name: "Newsletter",
    icon: "FileText",
    color: "#f59e0b",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    charLimit: 8000,
    description: "Value-first subscriber format",
  },
  blog: {
    name: "Blog Summary",
    icon: "BookOpen",
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    charLimit: 3000,
    description: "SEO meta + excerpt + highlights",
  },
} as const;

export type Platform = keyof typeof PLATFORM_CONFIG;
export const ALL_PLATFORMS = Object.keys(PLATFORM_CONFIG) as Platform[];
