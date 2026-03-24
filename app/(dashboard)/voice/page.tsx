import { VoiceProfilePage } from "@/components/voice/VoiceProfilePage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Voice Profile" };

export default function VoiceRoute() {
  return <VoiceProfilePage />;
}
