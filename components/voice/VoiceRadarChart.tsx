"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";
import type { VoiceProfile } from "@/lib/supabase";

interface VoiceRadarChartProps {
  profile: VoiceProfile;
}

export function VoiceRadarChart({ profile }: VoiceRadarChartProps) {
  const vocabularyScore = {
    everyday: 3,
    professional: 6,
    technical: 8,
    academic: 10,
  }[profile.vocabulary_tier] || 5;

  const sentenceLengthScore = Math.min(10, Math.round((profile.avg_sentence_length / 25) * 10));

  const data = [
    { subject: "Formality", value: profile.formality_score, fullMark: 10 },
    { subject: "Humour", value: profile.humour_level, fullMark: 10 },
    { subject: "Vocabulary", value: vocabularyScore, fullMark: 10 },
    { subject: "Sentence\nLength", value: sentenceLengthScore, fullMark: 10 },
    { subject: "Corrections\nApplied", value: Math.min(10, profile.corrections_applied), fullMark: 10 },
    { subject: "Samples", value: Math.min(10, profile.samples_count * 2), fullMark: 10 },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Voice Profile"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}/10`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
