import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  { NavbarContent}  from "@/components/NavbarContent";
import { IoHomeSharp } from "react-icons/io5";


function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export const NavbarMobile: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  // ESC closes drawer
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 ">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {/* simple hamburger */}
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-semibold text-lg flex items-center gap-2"
          >
            Faye Xiao
            <IoHomeSharp className="text-[#615952]"/>
          </button>

          <button
            type="button"
            onClick={() => navigate("/career/resume")}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-lg hover:bg-gray-50"
          >
            Resume
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Drawer */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-xl",
          "transform transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="font-semibold">Explore</div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-3.5rem)]">
          <NavbarContent onNavigateDone={() => setOpen(false)} />
        </div>
      </aside>
    </div>
  );
};