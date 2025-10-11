"use client";

import { siteData } from "@/data/sections";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";


export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        {/* Left: Brand name */}
        <Link
          href="/"
          // className="text-lg sm:text-xl font-extrabold text-[var(--brand)] transform transition-transform duration-200 no-underline hover:no-underline hover:scale-105"
          className="text-xl sm:text-2xl md:text-[1.6rem] font-extrabold tracking-tight text-[var(--brand)] transform transition-transform duration-200 hover:scale-105 hover:no-underline"

        >
          Digital SM Studio
        </Link>

        {/* Center: Logo placeholder */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 text-xs">
          Logo
        </div>

        {/* Right: Hamburger icon */}
        <button
          ref={buttonRef}
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)]"
        >
          {open ? (
            <X size={26} strokeWidth={2.2} className="text-[var(--brand)]" />
          ) : (
            <Menu size={26} strokeWidth={2.2} className="text-[var(--brand)]" />
          )}
        </button>
      </div>

      {/* Compact dropdown */}
      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="absolute right-6 top-[62px] w-56 bg-white border rounded-md shadow-lg py-3 px-3 z-50"
        >
          <nav className="flex flex-col gap-4 text-gray-800 text-sm">
            {/* ToolWiz Section */}
            <div>
              <h3 className="text-[var(--brand)] font-semibold mb-1 text-base">
                {siteData.toolwiz.title}
              </h3>
              <div className="flex flex-col gap-1 ml-2">
                {siteData.toolwiz.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.link}
                    onClick={() => setOpen(false)}
                    className="hover:text-[var(--brand)]"
                  >
                    {tool.name}
                  </Link>
                ))}
                <span className="text-gray-400 text-xs italic">
                  + Future tools auto-load
                </span>
              </div>
            </div>

            {/* Tool - ContextCard Link */}
            <Link href="/tools/contextcards" className="hover:text-violet-400 transition">
              Context Cards
            </Link>


            <div className="border-t border-gray-200 my-2"></div>

            {/* SMBotics Section */}
            <div>
              <h3 className="text-[var(--brand)] font-semibold mb-1 text-base">
                {siteData.smbotics.title}
              </h3>
              <div className="flex flex-col gap-1 ml-2">
                {siteData.smbotics.bots.map((bot, index) => (
                  <Link
                    key={index}
                    href={bot.link}
                    target="_blank"
                    className="hover:text-[var(--brand)]"
                  >
                    {bot.name}
                  </Link>
                ))}
                <span className="text-gray-400 text-xs italic">
                  + Future bots auto-load
                </span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
