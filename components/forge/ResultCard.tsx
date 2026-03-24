"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Copy, Check, RefreshCw, ChevronDown, ChevronUp,
  Star, Lightbulb, Edit3, Save
} from "lucide-react";
import { cn, PLATFORM_CONFIG } from "@/lib/utils";
import type { Platform } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ForgeResult } from "@/lib/stores/forge";
import {
  Twitter, Linkedin, Youtube, Mail, Instagram, Music, FileText, BookOpen
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  twitter: Twitter, linkedin: Linkedin, youtube: Youtube,
  email: Mail, instagram: Instagram, tiktok: Music,
  newsletter: FileText, blog: BookOpen,
};

interface ResultCardProps {
  result: ForgeResult;
  index: number;
  onVoiceCorrection?: (platform: string, original: string, edited: string) => void;
}

export function ResultCard({ result, index, onVoiceCorrection }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(result.content);
  const [savedEdit, setSavedEdit] = useState(false);
  const [activeHook, setActiveHook] = useState<number | null>(null);

  const config = PLATFORM_CONFIG[result.platform as Platform];
  const Icon = PLATFORM_ICONS[result.platform] || FileText;
  const charCount = editContent.length;
  const charLimit = config?.charLimit || 10000;
  const overLimit = charCount > charLimit;
  const score = result.critic_score;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(editContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editContent]);

  const handleSaveEdit = () => {
    if (editContent !== result.content && onVoiceCorrection) {
      onVoiceCorrection(result.platform, result.content, editContent);
    }
    setEditing(false);
    setSavedEdit(true);
    setTimeout(() => setSavedEdit(false), 2000);
  };

  const scoreColor =
    score && score >= 8 ? "success" :
    score && score >= 6 ? "warning" :
    "destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={cn(
        "rounded-xl border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow",
        config?.borderColor
      )}
    >
      {/* Header */}
      <div className={cn("px-4 py-3 flex items-center gap-3", config?.bgColor)}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: (config?.color || "#6366f1") + "25" }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: config?.color || "#6366f1" } as React.CSSProperties}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{config?.name || result.platform}</h3>
          <p className="text-xs text-muted-foreground">{config?.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {score !== null && (
            <Badge variant={scoreColor as "success" | "warning" | "destructive"} className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              {score?.toFixed(1)}
            </Badge>
          )}
          <span className={cn("text-xs font-mono", overLimit ? "text-destructive" : "text-muted-foreground")}>
            {charCount.toLocaleString()}/{charLimit.toLocaleString()}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Hook variants */}
          {result.hook_variants && result.hook_variants.length > 0 && (
            <div className="px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Hook variants</span>
              </div>
              <div className="space-y-1.5">
                {result.hook_variants.map((hook, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHook(activeHook === i ? null : i)}
                    className={cn(
                      "w-full text-left text-xs p-2 rounded-lg border transition-all",
                      activeHook === i
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/20 bg-background"
                    )}
                  >
                    <span className="text-muted-foreground mr-1.5">#{i + 1}</span>
                    {hook}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {editing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] text-sm font-mono"
                autoFocus
              />
            ) : (
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90 max-h-80 overflow-y-auto scrollbar-thin">
                {editContent}
              </pre>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-4 pb-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </Button>

            {editing ? (
              <>
                <Button size="sm" variant="default" onClick={handleSaveEdit} className="gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  {savedEdit ? "Saved!" : "Save & Learn"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditContent(result.content); }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                className="gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}

            {result.critic_feedback && (
              <div className="ml-auto">
                <span className="text-xs text-muted-foreground">
                  {(result.critic_feedback as { feedback?: string }).feedback?.slice(0, 50) || ""}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
