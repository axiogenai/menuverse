import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 md:overflow-hidden w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col md:overflow-y-auto min-w-0 w-full">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
