"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2, Plus, X, Sparkles, Brain, AlertCircle, CheckCircle2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceRadarChart } from "./VoiceRadarChart";
import type { VoiceProfile } from "@/lib/supabase";

export function VoiceProfilePage() {
  const [samples, setSamples] = useState<string[]>(["", "", ""]);
  const [profile, setProfile] = useState<VoiceProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/voice")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleAddSample = () => {
    if (samples.length < 5) setSamples([...samples, ""]);
  };

  const handleRemoveSample = (i: number) => {
    setSamples(samples.filter((_, idx) => idx !== i));
  };

  const handleSampleChange = (i: number, value: string) => {
    const updated = [...samples];
    updated[i] = value;
    setSamples(updated);
  };

  const handleAnalyze = async () => {
    const validSamples = samples.filter((s) => s.trim().length >= 50);
    if (validSamples.length === 0) {
      setError("Add at least one writing sample (50+ characters)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samples: validSamples }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze");
        return;
      }
      setProfile(data.profile);
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 pt-20 md:pt-8">
        <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-[#0d1117] tracking-tight mb-1">Voice Profile</h1>
        <p className="text-[#6b7280] text-[15px]">
          Train the AI to write exactly like you. Paste 1–5 writing samples you&apos;re proud of.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: Input samples */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Writing Samples</h2>
            {samples.length < 5 && (
              <Button variant="ghost" size="sm" onClick={handleAddSample} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add sample
              </Button>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {samples.map((sample, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Sample {i + 1}</span>
                  <span className="text-xs text-muted-foreground">({sample.length} chars)</span>
                  {samples.length > 1 && (
                    <button
                      onClick={() => handleRemoveSample(i)}
                      className="ml-auto p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Textarea
                  placeholder={
                    i === 0
                      ? "Paste a piece of your writing here — a tweet thread, LinkedIn post, blog intro, or newsletter. The more authentic, the better..."
                      : "Another sample — different context works well (e.g. if #1 is a blog, try a casual tweet thread here)..."
                  }
                  value={sample}
                  onChange={(e) => handleSampleChange(i, e.target.value)}
                  className="min-h-[140px] text-sm"
                />
              </motion.div>
            ))}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <p className="font-medium">Tips for better voice detection:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-blue-600 dark:text-blue-500">
                  <li>Use samples with 100+ words each for best results</li>
                  <li>Mix writing contexts (casual + professional) if you have both</li>
                  <li>Use content you wrote yourself, not edited by others</li>
                  <li>The more corrections you make later, the better it learns</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-4 text-sm text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Voice profile analyzed and saved! The radar chart has been updated.
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing your voice...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {profile ? "Re-analyze Voice" : "Analyze My Voice"}
              </>
            )}
          </Button>
        </div>

        {/* Right: Profile display */}
        <div className="space-y-6">
          {profile ? (
            <>
              {/* Radar chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-violet-500" />
                    Voice Fingerprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VoiceRadarChart profile={profile} />
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Updates with every correction you make to generated outputs
                  </p>
                </CardContent>
              </Card>

              {/* Profile stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-primary" />
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProfileStat
                    label="Formality"
                    value={profile.formality_score}
                    max={10}
                    lowLabel="Casual"
                    highLabel="Formal"
                  />
                  <ProfileStat
                    label="Humour Level"
                    value={profile.humour_level}
                    max={10}
                    lowLabel="Serious"
                    highLabel="Playful"
                  />

                  <div className="pt-2 border-t space-y-3">
                    <ProfileTag
                      label="Vocabulary"
                      value={profile.vocabulary_tier}
                      className="capitalize"
                    />
                    <ProfileTag
                      label="Opening style"
                      value={profile.opening_style?.replace(/_/g, " ")}
                      className="capitalize"
                    />
                    <ProfileTag
                      label="CTA preference"
                      value={profile.preferred_cta?.replace(/_/g, " ")}
                      className="capitalize"
                    />
                  </div>

                  {profile.tone_adjectives?.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Tone adjectives</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.tone_adjectives.map((adj) => (
                          <Badge key={adj} variant="secondary" className="text-xs capitalize">
                            {adj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.signature_phrases?.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Signature phrases</p>
                      <div className="space-y-1">
                        {profile.signature_phrases.slice(0, 3).map((phrase) => (
                          <p key={phrase} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            &ldquo;{phrase}&rdquo;
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span>Based on {profile.samples_count} samples</span>
                    <span>{profile.corrections_applied} corrections applied</span>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <Mic2 className="w-8 h-8 text-violet-500" />
              </div>
              <h3 className="font-semibold mb-2">No voice profile yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your writing samples and click &ldquo;Analyze My Voice&rdquo; to build your personalized AI voice profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileStat({
  label, value, max, lowLabel, highLabel
}: {
  label: string;
  value: number;
  max: number;
  lowLabel: string;
  highLabel: string;
}) {
  const percent = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-muted-foreground">{value}/{max}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-forge-500 to-violet-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function ProfileTag({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant="outline" className={`text-xs ${className}`}>{value}</Badge>
    </div>
  );
}
