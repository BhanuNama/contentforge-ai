"use client";

import { useState, useEffect } from "react";

type UsageData = {
  plan: "free" | "pro";
  repurposes_used: number;
  repurposes_limit: number;
};

export function useUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setUsage(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { usage, loading };
}
