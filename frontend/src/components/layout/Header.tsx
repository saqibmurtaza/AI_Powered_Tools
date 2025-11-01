// Option 1: Professional Left-Aligned Layout (Most Common)

"use client";

import { siteData } from "@/data/sections";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
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
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Left: Logo + Brand together - OPTION 1 STYLING */}
        <Link href="/" className="flex items-center gap-4 hover:no-underline group">
          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Image 
              src="/logo.png"  
              alt="Digital SM Studio" 
              width={40} 
              height={40}
              className="object-contain" // Makes logo white on gradient
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">Digital SM</span>
            <span className="text-sm text-gray-600 -mt-1">Studio</span>
          </div>
        </Link>

        {/* Right: Navigation + Menu */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-[#7C3AED] font-medium transition-colors">Home</Link>
            <Link href="/tools" className="text-gray-700 hover:text-[#7C3AED] font-medium transition-colors">Tools</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#7C3AED] font-medium transition-colors">About</Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)] hover:bg-gray-50 transition-colors"
          >
            {open ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="absolute right-6 top-[76px] w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-4 px-4 z-50"
        >
          <nav className="flex flex-col gap-4 text-gray-800">
            {/* Mobile Navigation Links */}
            <Link href="/" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
              About
            </Link>

            <div className="border-t border-gray-200 my-2"></div>

            {/* ToolWiz Section */}
            <div>
              <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
                <Link href="/tools" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-semibold" onClick={() => setOpen(false)}>
                  Tools
                </Link>
              </h3>
              <div className="flex flex-col gap-2 ml-2">
                {siteData.toolwiz.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.link}
                    onClick={() => setOpen(false)}
                    className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
                <span className="text-gray-400 text-xs italic mt-1">
                  + Future tools auto-load
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            {/* SMBotics Section */}
            <div>
              <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
                SMBotics
              </h3>
              <div className="flex flex-col gap-2 ml-2">
                {siteData.smbotics.bots.map((bot, index) => (
                  <Link
                    key={index}
                    href={bot.link}
                    target="_blank"
                    className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    {bot.name}
                  </Link>
                ))}
                <span className="text-gray-400 text-xs italic mt-1">
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

