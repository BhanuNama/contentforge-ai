"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Link as LinkIcon, X, AlertCircle, Zap, RotateCcw,
  Loader2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlatformSelector } from "./PlatformSelector";
import { AgentVisualizer } from "./AgentVisualizer";
import { ResultCard } from "./ResultCard";
import { useForgeStore } from "@/lib/stores/forge";
import type { Platform } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MIN_CONTENT_LENGTH = 100;

export function ForgePage() {
  const searchParams = useSearchParams();
  const preloadJobId = searchParams.get("jobId");

  const {
    inputContent, setInputContent,
    selectedPlatforms, togglePlatform,
    jobId, jobStatus, jobError,
    agentSteps, results,
    setJobId, setJobStatus, setJobError,
    updateAgentStep, setResults,
    reset,
  } = useForgeStore();

  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [scrapingUrl, setScrapingUrl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const wordCount = inputContent.trim().split(/\s+/).filter(Boolean).length;
  const isRunning = jobStatus === "running" || jobStatus === "pending";
  const isDone = jobStatus === "done";
  const canForge = inputContent.length >= MIN_CONTENT_LENGTH && selectedPlatforms.length > 0 && !isRunning;

  // Load existing job results if jobId is in URL
  useEffect(() => {
    if (preloadJobId && preloadJobId !== jobId) {
      fetch(`/api/forge/${preloadJobId}/results`)
        .then((r) => r.json())
        .then((data) => {
          if (data.results?.length > 0) {
            setResults(data.results);
            setJobId(preloadJobId);
            setJobStatus("done");
          }
        })
        .catch(() => {});
    }
  }, [preloadJobId]);

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) return;
    setScrapingUrl(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setInputContent(data.content);
        setShowUrlInput(false);
        setUrlInput("");
      } else {
        alert(data.error || "Failed to fetch URL");
      }
    } catch {
      alert("Could not fetch URL. Try pasting the content manually.");
    } finally {
      setScrapingUrl(false);
    }
  };

  const startAgentSimulation = useCallback(() => {
    const timings = [
      { id: "orchestrator", runAt: 500, doneAt: 3500 },
      { id: "analyst", runAt: 3500, doneAt: 7000 },
      { id: "platforms", runAt: 7000, doneAt: 22000 },
      { id: "critic", runAt: 22000, doneAt: 28000 },
      { id: "voice", runAt: 28000, doneAt: 31000 },
    ];
    timings.forEach(({ id, runAt, doneAt }) => {
      setTimeout(() => updateAgentStep(id, { status: "running", startedAt: Date.now() }), runAt);
      setTimeout(() => updateAgentStep(id, { status: "done", completedAt: Date.now() }), doneAt);
    });
  }, [updateAgentStep]);

  const handleForge = async () => {
    if (!canForge) return;
    reset();
    setIsSubmitting(true);
    setJobStatus("pending");

    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputContent, platforms: selectedPlatforms }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJobError(data.error || "Failed to start job");
        setJobStatus("failed");
        return;
      }

      setJobId(data.jobId);
      setJobStatus("running");
      startAgentSimulation();

      const es = new EventSource(`/api/forge/${data.jobId}/stream`);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "complete") {
          setResults(msg.results);
          setJobStatus("done");
          es.close();
        } else if (msg.type === "error") {
          setJobError(msg.message);
          setJobStatus("failed");
          es.close();
        }
      };

      es.onerror = () => {
        setJobError("Connection lost. Your content may still be processing — check your library.");
        setJobStatus("failed");
        es.close();
      };
    } catch {
      setJobError("Network error. Please try again.");
      setJobStatus("failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceCorrection = async (platform: string, original: string, edited: string) => {
    try {
      await fetch("/api/voice/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, original, edited }),
      });
    } catch {
      // Voice learning is best-effort
    }
  };

  useEffect(() => {
    return () => eventSourceRef.current?.close();
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
      {/* Page header */}
      <div className="px-6 py-5 md:px-8 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Forge Content</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Paste content → 5 AI agents → 10+ formats in 45s
          </p>
        </div>
        {(isDone || jobStatus === "failed") && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            New Forge
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {!isDone && (
            <>
              {/* Content input */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Source Content</label>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-mono",
                      wordCount < 50 ? "text-muted-foreground" : "text-emerald-500"
                    )}>
                      {wordCount} words
                    </span>
                    <button
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-xs flex items-center gap-1"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <Globe className="w-3 h-3" />
                      Import from URL
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showUrlInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="flex gap-2 p-3 rounded-xl border" style={{ background: "var(--color-muted)" }}>
                        <LinkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-muted-foreground)" }} />
                        <input
                          type="url"
                          placeholder="https://yoursite.com/blog/your-post"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleScrapeUrl()}
                          className="flex-1 bg-transparent text-sm outline-none"
                          style={{ color: "var(--color-foreground)" }}
                        />
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="default" onClick={handleScrapeUrl} disabled={scrapingUrl} className="gap-1.5">
                            {scrapingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                            Fetch
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowUrlInput(false)}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Textarea
                  placeholder={`Paste your blog post, article, essay, or newsletter here...

The AI reads the full context — the more you give it, the better the outputs.
Minimum 100 characters. Best results with 400+ words.`}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  disabled={isRunning}
                  className="min-h-[260px] text-sm leading-relaxed"
                />

                {inputContent.length > 0 && inputContent.length < MIN_CONTENT_LENGTH && (
                  <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color: "#f59e0b" }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {MIN_CONTENT_LENGTH - inputContent.length} more characters needed
                  </p>
                )}
              </div>

              {/* Platform selector */}
              <div className="mb-6">
                <PlatformSelector
                  selected={selectedPlatforms}
                  onToggle={togglePlatform}
                  disabled={isRunning}
                />
              </div>

              {/* Agent visualizer (inline on mobile) */}
              <div className="lg:hidden mb-4">
                <AgentVisualizer steps={agentSteps} isVisible={isRunning} />
              </div>

              {/* Error state */}
              {jobStatus === "failed" && jobError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border flex items-start gap-3"
                  style={{
                    borderColor: "rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.05)",
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-destructive)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-destructive)" }}>
                      Pipeline Error
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                      {jobError}
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Results */}
          {isDone && results.length > 0 && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6 p-4 rounded-xl border"
                style={{
                  background: "rgba(16,185,129,0.05)",
                  borderColor: "rgba(16,185,129,0.2)",
                }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#10b981" }}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#10b981" }}>
                    {results.length} outputs forged successfully
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    All passed quality critic. Edit any output to train your voice profile.
                  </p>
                </div>
              </motion.div>
              <div className="space-y-4">
                {results.map((result, i) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    index={i}
                    onVoiceCorrection={handleVoiceCorrection}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div
          className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l overflow-y-auto p-6 md:p-8 flex flex-col gap-6"
          style={{ background: "var(--color-muted)" }}
        >
          {/* Forge button */}
          <div>
            <Button
              onClick={handleForge}
              disabled={!canForge || isSubmitting}
              variant="gradient"
              className="w-full h-14 text-base font-semibold"
            >
              {isRunning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Pipeline Running...
                </>
              ) : isDone ? (
                <>
                  <RotateCcw className="w-5 h-5" />
                  Forge Again
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Forge Content
                </>
              )}
            </Button>

            <p className="text-xs text-center mt-2" style={{ color: "var(--color-muted-foreground)" }}>
              ~45 seconds · 5 AI agents · {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Selected platforms pills */}
          {selectedPlatforms.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-muted-foreground)" }}>
                Generating for:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlatforms.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs capitalize">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Agent visualizer (desktop) */}
          <div className="hidden lg:block">
            <AgentVisualizer steps={agentSteps} isVisible={isRunning} />
          </div>

          {/* Pipeline explanation (when idle) */}
          {!isRunning && !isDone && (
            <div className="rounded-xl border p-4" style={{ background: "var(--color-card)" }}>
              <h4 className="text-sm font-semibold mb-3">What happens:</h4>
              <div className="space-y-3">
                {[
                  { emoji: "🧠", title: "Orchestrator", desc: "Plans the pipeline with ReAct pattern" },
                  { emoji: "🔍", title: "Content Analyst", desc: "Extracts core ideas, hooks, and stats" },
                  { emoji: "⚡", title: "Platform Specialists", desc: `${selectedPlatforms.length} agents run in parallel` },
                  { emoji: "✅", title: "Quality Critic", desc: "Reviews every output before delivery" },
                  { emoji: "🎙️", title: "Voice Agent", desc: "Applies your brand voice to all outputs" },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span className="text-lg leading-tight">{step.emoji}</span>
                    <div>
                      <p className="text-xs font-medium">{step.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
