"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, PLATFORM_CONFIG, ALL_PLATFORMS } from "@/lib/utils";
import type { Platform } from "@/lib/utils";
import {
  Twitter, Linkedin, Youtube, Mail, Instagram, Music, FileText, BookOpen
} from "lucide-react";

const PLATFORM_ICON_COLORS: Record<Platform, string> = {
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  email: "#6366f1",
  instagram: "#E1306C",
  tiktok: "#555",
  newsletter: "#f59e0b",
  blog: "#10b981",
};

const PLATFORM_ICONS: Record<Platform, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  email: Mail,
  instagram: Instagram,
  tiktok: Music,
  newsletter: FileText,
  blog: BookOpen,
};

interface PlatformSelectorProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
  disabled?: boolean;
}

export function PlatformSelector({ selected, onToggle, disabled }: PlatformSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Select platforms ({selected.length} selected)
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => ALL_PLATFORMS.forEach((p) => !selected.includes(p) && onToggle(p))}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-40"
          >
            Select all
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            onClick={() => selected.forEach((p) => onToggle(p))}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_PLATFORMS.map((platform) => {
          const config = PLATFORM_CONFIG[platform];
          const isSelected = selected.includes(platform);
          const Icon = PLATFORM_ICONS[platform];

          return (
            <motion.button
              key={platform}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(platform)}
              disabled={disabled}
              className={cn(
                "relative flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all duration-200",
                "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40 bg-card",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: PLATFORM_ICON_COLORS[platform] + "20" }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: PLATFORM_ICON_COLORS[platform] } as React.CSSProperties}
                />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight">{config.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {config.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
