"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, XCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStep } from "@/lib/stores/forge";

interface AgentVisualizerProps {
  steps: AgentStep[];
  isVisible: boolean;
}

const stepIcons = {
  orchestrator: "🧠",
  analyst: "🔍",
  platforms: "⚡",
  critic: "✅",
  voice: "🎙️",
};

export function AgentVisualizer({ steps, isVisible }: AgentVisualizerProps) {
  if (!isVisible) return null;

  const completedCount = steps.filter((s) => s.status === "done").length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forge-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {steps.some((s) => s.status === "running") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">AI Pipeline Running</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {steps.length} agents complete
            </p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-2xl font-bold text-gradient">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-forge-500 to-violet-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                step.status === "running" && "bg-primary/5 border border-primary/20",
                step.status === "done" && "bg-emerald-50/50 dark:bg-emerald-950/20",
                step.status === "failed" && "bg-red-50/50 dark:bg-red-950/20",
                step.status === "pending" && "opacity-50"
              )}
            >
              <span className="text-xl w-8 text-center flex-shrink-0">
                {stepIcons[step.id as keyof typeof stepIcons] || "🤖"}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{step.name}</span>
                  {step.status === "running" && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium animate-pulse">
                      Running
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {step.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                {step.status === "pending" && (
                  <Circle className="w-5 h-5 text-muted-foreground/40" />
                )}
                {step.status === "running" && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                {step.status === "done" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {step.status === "failed" && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
