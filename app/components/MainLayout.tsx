"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/SideBar";
import TopHeader from "@/components/ui/TopHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] md:grid-rows-[70px_1fr] overflow-y-auto bg-white text-white font-bold h-screen z-50">
      <div className="row-start-1 md:row-start-1 md:col-start-2 bg-[#1D2636] z-50">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {sidebarOpen && (
        <div className="row-start-2 md:row-start-1 md:col-start-1 md:row-span-2 bg-[#1D2636] z-40">
          <Sidebar />
        </div>
      )}

      <div className="row-start-3 md:row-start-2 md:col-start-2 bg-[#0D121F] overflow-y-auto z-30">
        {children}
      </div>
    </div>
  );
}
