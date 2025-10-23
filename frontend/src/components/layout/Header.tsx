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
                {siteData.toolwiz.title}
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
                {siteData.smbotics.title}
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

// Option 2: Minimal Centered Layout (Clean & Modern)

// "use client";

// import { siteData } from "@/data/sections";
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from 'next/image';
// import { Menu, X } from "lucide-react";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const target = e.target as Node;
//       if (
//         open &&
//         menuRef.current &&
//         !menuRef.current.contains(target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(target)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [open]);

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b">
//       <div className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
//         {/* Left: Empty space for balance */}
//         <div className="w-10 md:w-12"></div>

//         {/* Center: Compact logo + text */}
//         <Link href="/" className="flex items-center gap-3 hover:no-underline group">
//           <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
//             <Image 
//               src="/logo.png" 
//               alt="Digital SM Studio" 
//               width={32} 
//               height={32}
//               className="object-contain"
//             />
//           </div>
//           <span className="text-lg font-semibold text-gray-900">Digital SM Studio</span>
//         </Link>

//         {/* Right: Menu */}
//         <button
//           ref={buttonRef}
//           onClick={() => setOpen((s) => !s)}
//           aria-expanded={open}
//           aria-controls="site-menu"
//           className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
//         >
//           {open ? (
//             <X size={24} className="text-gray-700" />
//           ) : (
//             <Menu size={24} className="text-gray-700" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {open && (
//         <div
//           id="site-menu"
//           ref={menuRef}
//           className="absolute right-6 top-[72px] w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-4 px-4 z-50"
//         >
//           <nav className="flex flex-col gap-4 text-gray-800">
//             {/* Mobile Navigation Links */}
//             <Link href="/" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
//               Home
//             </Link>
//             <Link href="/about" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
//               About
//             </Link>

//             <div className="border-t border-gray-200 my-2"></div>

//             {/* ToolWiz Section */}
//             <div>
//               <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
//                 {siteData.toolwiz.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.toolwiz.tools.map((tool) => (
//                   <Link
//                     key={tool.id}
//                     href={tool.link}
//                     onClick={() => setOpen(false)}
//                     className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
//                   >
//                     {tool.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future tools auto-load
//                 </span>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 my-2"></div>

//             {/* SMBotics Section */}
//             <div>
//               <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
//                 {siteData.smbotics.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.smbotics.bots.map((bot, index) => (
//                   <Link
//                     key={index}
//                     href={bot.link}
//                     target="_blank"
//                     className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
//                   >
//                     {bot.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future bots auto-load
//                 </span>
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

// Option 3: Professional with Subtle Background

// "use client";

// import { siteData } from "@/data/sections";
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from 'next/image';
// import { Menu, X } from "lucide-react";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const target = e.target as Node;
//       if (
//         open &&
//         menuRef.current &&
//         !menuRef.current.contains(target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(target)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [open]);

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
//       <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
//         {/* Brand with refined styling */}
//         <Link href="/" className="flex items-center gap-3 hover:no-underline group">
//           <div className="w-10 h-10 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex items-center justify-center group-hover:shadow-md transition-all duration-200">
//             <Image 
//               src="/logo.png" 
//               alt="Digital SM Studio" 
//               width={28} 
//               height={28}
//               className="object-contain"
//             />
//           </div>
//           <div>
//             <span className="text-lg font-bold text-gray-900 block leading-tight">Digital SM</span>
//             <span className="text-xs text-gray-500 block leading-tight">Studio</span>
//           </div>
//         </Link>

//         {/* Right side */}
//         <button
//           ref={buttonRef}
//           onClick={() => setOpen((s) => !s)}
//           aria-expanded={open}
//           aria-controls="site-menu"
//           className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-200"
//         >
//           {open ? (
//             <X size={20} className="text-gray-600" />
//           ) : (
//             <Menu size={20} className="text-gray-600" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {open && (
//         <div
//           id="site-menu"
//           ref={menuRef}
//           className="absolute right-6 top-[60px] w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl py-4 px-4 z-50"
//         >
//           <nav className="flex flex-col gap-4 text-gray-800">
//             {/* Mobile Navigation Links */}
//             <Link href="/" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
//               Home
//             </Link>
//             <Link href="/about" className="hover:text-[#7C3AED] py-2 px-3 rounded-md hover:bg-purple-50 transition-colors font-medium" onClick={() => setOpen(false)}>
//               About
//             </Link>

//             <div className="border-t border-gray-200 my-2"></div>

//             {/* ToolWiz Section */}
//             <div>
//               <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
//                 {siteData.toolwiz.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.toolwiz.tools.map((tool) => (
//                   <Link
//                     key={tool.id}
//                     href={tool.link}
//                     onClick={() => setOpen(false)}
//                     className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
//                   >
//                     {tool.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future tools auto-load
//                 </span>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 my-2"></div>

//             {/* SMBotics Section */}
//             <div>
//               <h3 className="text-[#7C3AED] font-semibold mb-2 text-base border-b border-gray-100 pb-2">
//                 {siteData.smbotics.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.smbotics.bots.map((bot, index) => (
//                   <Link
//                     key={index}
//                     href={bot.link}
//                     target="_blank"
//                     className="hover:text-[#7C3AED] py-1 px-2 rounded-md hover:bg-purple-50 transition-colors"
//                   >
//                     {bot.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future bots auto-load
//                 </span>
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

//  Option 4: Premium Dark Theme

// "use client";

// import { siteData } from "@/data/sections";
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from 'next/image';
// import { Menu, X } from "lucide-react";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const target = e.target as Node;
//       if (
//         open &&
//         menuRef.current &&
//         !menuRef.current.contains(target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(target)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [open]);

//   return (
//     // <header className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 border-b border-gray-800">
//     <header className="fixed top-0 left-0 w-full bg-[#0f1724] text-white z-50 border-b border-white/10">
//       <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
//         {/* Brand with dark theme styling */}
//         <Link href="/" className="flex items-center gap-3 hover:no-underline group">
//           <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
//             <Image 
//               src="/logo.png" 
//               alt="Digital SM Studio" 
//               width={32} 
//               height={32}
//               className="object-contain"
//             />
//           </div>
//           <span className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors">Digital SM Studio</span>
//         </Link>

//         {/* Right: Menu */}
//         <button
//           ref={buttonRef}
//           onClick={() => setOpen((s) => !s)}
//           aria-expanded={open}
//           aria-controls="site-menu"
//           className="p-3 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600"
//         >
//           {open ? (
//             <X size={24} className="text-white" />
//           ) : (
//             <Menu size={24} className="text-white" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Dropdown Menu - Dark Theme */}
//       {open && (
//         <div
//           id="site-menu"
//           ref={menuRef}
//           className="absolute right-6 top-[80px] w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-4 px-4 z-50 backdrop-blur-sm"
//         >
//           <nav className="flex flex-col gap-4 text-gray-200">
//             {/* Mobile Navigation Links */}
//             <Link 
//               href="/" 
//               className="hover:text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors font-medium border-l-2 border-transparent hover:border-purple-500" 
//               onClick={() => setOpen(false)}
//             >
//               Home
//             </Link>
//             <Link 
//               href="/about" 
//               className="hover:text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors font-medium border-l-2 border-transparent hover:border-purple-500" 
//               onClick={() => setOpen(false)}
//             >
//               About
//             </Link>

//             <div className="border-t border-gray-700 my-2"></div>

//             {/* ToolWiz Section */}
//             <div>
//               <h3 className="text-purple-400 font-semibold mb-2 text-base border-b border-gray-700 pb-2">
//                 {siteData.toolwiz.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.toolwiz.tools.map((tool) => (
//                   <Link
//                     key={tool.id}
//                     href={tool.link}
//                     onClick={() => setOpen(false)}
//                     className="hover:text-white py-1 px-2 rounded-md hover:bg-gray-700 transition-colors border-l-2 border-transparent hover:border-purple-400"
//                   >
//                     {tool.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future tools auto-load
//                 </span>
//               </div>
//             </div>

//             <div className="border-t border-gray-700 my-2"></div>

//             {/* SMBotics Section */}
//             <div>
//               <h3 className="text-purple-400 font-semibold mb-2 text-base border-b border-gray-700 pb-2">
//                 {siteData.smbotics.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.smbotics.bots.map((bot, index) => (
//                   <Link
//                     key={index}
//                     href={bot.link}
//                     target="_blank"
//                     className="hover:text-white py-1 px-2 rounded-md hover:bg-gray-700 transition-colors border-l-2 border-transparent hover:border-purple-400"
//                   >
//                     {bot.name}
//                   </Link>
//                 ))}
//                 <span className="text-gray-400 text-xs italic mt-1">
//                   + Future bots auto-load
//                 </span>
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }


// "use client";

// import { siteData } from "@/data/sections";
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from 'next/image';
// import { Menu, X } from "lucide-react";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const target = e.target as Node;
//       if (
//         open &&
//         menuRef.current &&
//         !menuRef.current.contains(target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(target)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, [open]);

//   return (
//     <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white z-50 shadow-lg">
//       <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
//         {/* Brand with your theme background */}
//         <Link href="/" className="flex items-center gap-3 hover:no-underline group">
//           <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
//             <Image 
//               src="/logo.png" 
//               alt="Digital SM Studio" 
//               width={32} 
//               height={32}
//               className="object-contain"
//             />
//           </div>
//           <span className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors">
//             Digital SM Studio
//           </span>
//         </Link>

//         {/* Right: Menu */}
//         <button
//           ref={buttonRef}
//           onClick={() => setOpen((s) => !s)}
//           aria-expanded={open}
//           aria-controls="site-menu"
//           className="p-3 rounded-lg hover:bg-white/20 transition-colors border border-white/30 hover:border-white/40 backdrop-blur-sm"
//         >
//           {open ? (
//             <X size={24} className="text-white" />
//           ) : (
//             <Menu size={24} className="text-white" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Dropdown Menu - Your Theme Background */}
//       {open && (
//         <div
//           id="site-menu"
//           ref={menuRef}
//           className="absolute right-6 top-[80px] w-64 bg-gradient-to-br from-[#4D0682] to-[#7C3AED] backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-4 px-4 z-50"
//         >
//           <nav className="flex flex-col gap-4 text-white">
//             {/* Mobile Navigation Links */}
//             <Link 
//               href="/" 
//               className="hover:text-white py-2 px-3 rounded-md hover:bg-white/20 transition-colors font-medium border-l-2 border-transparent hover:border-white" 
//               onClick={() => setOpen(false)}
//             >
//               Home
//             </Link>
//             <Link 
//               href="/about" 
//               className="hover:text-white py-2 px-3 rounded-md hover:bg-white/20 transition-colors font-medium border-l-2 border-transparent hover:border-white" 
//               onClick={() => setOpen(false)}
//             >
//               About
//             </Link>

//             <div className="border-t border-white/20 my-2"></div>

//             {/* ToolWiz Section */}
//             <div>
//               <h3 className="text-white font-semibold mb-3 text-lg border-b border-white/20 pb-2">
//                 {siteData.toolwiz.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.toolwiz.tools.map((tool) => (
//                   <Link
//                     key={tool.id}
//                     href={tool.link}
//                     onClick={() => setOpen(false)}
//                     className="hover:text-white py-2 px-3 rounded-md hover:bg-white/20 transition-colors border-l-2 border-transparent hover:border-white"
//                   >
//                     {tool.name}
//                   </Link>
//                 ))}
//                 <span className="text-white/70 text-xs italic mt-2">
//                   + Future tools auto-load
//                 </span>
//               </div>
//             </div>

//             <div className="border-t border-white/20 my-2"></div>

//             {/* SMBotics Section */}
//             <div>
//               <h3 className="text-white font-semibold mb-3 text-lg border-b border-white/20 pb-2">
//                 {siteData.smbotics.title}
//               </h3>
//               <div className="flex flex-col gap-2 ml-2">
//                 {siteData.smbotics.bots.map((bot, index) => (
//                   <Link
//                     key={index}
//                     href={bot.link}
//                     target="_blank"
//                     className="hover:text-white py-2 px-3 rounded-md hover:bg-white/20 transition-colors border-l-2 border-transparent hover:border-white"
//                   >
//                     {bot.name}
//                   </Link>
//                 ))}
//                 <span className="text-white/70 text-xs italic mt-2">
//                   + Future bots auto-load
//                 </span>
//               </div>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

