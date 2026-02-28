// AppLayout.jsx
import React from 'react'

import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navbar1 from "./components/Navbar1";


const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col lg:flex-row font-nunito">
      {/* Left sidebar (md+) + mobile bottom bar are inside Navbar */}
      {/* <Navbar /> */}
      <Navbar1 />


      {/* Vertical divider on md+ */}
      <div className="hidden lg:block w-[2px] bg-gray-200 self-stretch" />

      {/* Routed content. pb-16 so the fixed mobile bar doesn’t cover content */}
      <main
          id="app-scroll"
          className="flex-1 min-w-0 min-h-0 relative overflow-y-auto"
          onScroll={(e) => {
            const show = e.currentTarget.scrollTop < 40;
            document.body.classList.toggle("at-top", show);
          }}
        >      
        <Outlet />
      </main>

      {/* Optional: the thin line just above the mobile bar
      <div className="md:hidden fixed inset-x-0 bottom-16 h-[2px] bg-gray-200 z-40" /> */}
    </div>
  );
}

export default AppLayout;