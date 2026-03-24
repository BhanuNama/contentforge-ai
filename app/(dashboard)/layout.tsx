import { ClerkProvider } from "@clerk/nextjs";
import { DashboardNav } from "@/components/shared/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex bg-[#f9fafb]">
        <DashboardNav />
        <main className="flex-1 min-h-screen flex flex-col md:ml-64 pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </ClerkProvider>
  );
}
