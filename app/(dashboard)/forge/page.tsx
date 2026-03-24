import { Suspense } from "react";
import { ForgePage } from "@/components/forge/ForgePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forge Content",
};

export default function ForgeRoute() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
      </div>
    }>
      <ForgePage />
    </Suspense>
  );
}
