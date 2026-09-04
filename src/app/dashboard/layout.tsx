import React from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden min-w-0 w-full">
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
