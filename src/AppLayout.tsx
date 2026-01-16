// AppLayout.jsx
import React from 'react'

import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row font-nunito">
      {/* Left sidebar (md+) + mobile bottom bar are inside Navbar */}
      <Navbar />

      {/* Vertical divider on md+ */}
      <div className="hidden md:block w-[2px] bg-gray-200 self-stretch" />

      {/* Routed content. pb-16 so the fixed mobile bar doesn’t cover content */}
      <main className="flex-1 relative pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Optional: the thin line just above the mobile bar */}
      <div className="md:hidden fixed inset-x-0 bottom-16 h-[2px] bg-gray-200 z-40" />
    </div>
  );
}

export default AppLayout;