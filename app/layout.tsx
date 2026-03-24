import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ContentForge AI — One Input. Ten Outputs. Zero Repetition.",
    template: "%s | ContentForge AI",
  },
  description:
    "AI-native content repurposing SaaS. Paste one piece of content, get 10+ platform-specific formats in 45 seconds. Powered by a 5-agent AI pipeline.",
  keywords: ["content repurposing", "AI content", "social media", "content marketing"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  openGraph: {
    title: "ContentForge AI",
    description: "One Input. Ten Outputs. Zero Repetition.",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
