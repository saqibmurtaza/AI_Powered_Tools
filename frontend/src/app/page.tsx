// "use client";

// import React from "react";
// import Link from "next/link";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// function ToolsSection() {
//   return (
//     <section className="px-6 pt-28 pb-16 text-center"> {/* increased top spacing */}
//       <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand)] mb-8">
//         ToolWiz — Useful Online Tools
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 justify-center max-w-5xl mx-auto">
//         <Card id="contextcards" className="hover:shadow-lg border-brand/20 max-w-sm mx-auto">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold text-[var(--brand)]">ContextCards</CardTitle>
//             <CardDescription className="text-gray-600">
//               Create structured context notes to use in AI prompts.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white w-full">
//               <Link href="#">Launch Tool</Link>
//             </Button>
//           </CardContent>
//         </Card>

//         <Card id="agecalculator" className="hover:shadow-lg border-brand/20 max-w-sm mx-auto">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold text-[var(--brand)]">Age Calculator</CardTitle>
//             <CardDescription className="text-gray-600">
//               Quickly calculate your age with precision and simplicity.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white w-full">
//               <Link href="#">Launch Tool</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </section>
//   );
// }

// function SMBoticsSection() {
//   const bots = [
//     {
//       title: "Shopping Agent",
//       desc: "An AI chatbot that assists users with product search, cart recovery, and personalized recommendations.",
//       link: "https://saqibmurtaza-chainlit-shopping-agent.hf.space/",
//     },
//     {
//       title: "Student AI Chatbot",
//       desc: "A study assistant designed to help students with learning, productivity, and Q&A.",
//       link: "https://saqibmurtaza-student-ai-chatbot.hf.space/",
//     },
//     {
//       title: "Salon Booking Bot (UK)",
//       desc: "Automates salon appointment scheduling and client engagement for beauty businesses.",
//       link: "https://asuno-salon-england.onrender.com",
//     },
//   ];

//   return (
//     <section className="px-6 py-16 bg-gray-50 text-center">
//       <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand)] mb-4">
//         SMBotics — AI Agents that Automate and Engage
//       </h2>
//       <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
//         Custom conversational agents designed to automate customer interactions, boost engagement,
//         and personalize user experiences.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {bots.map((bot) => (
//           <Card key={bot.title} className="hover:shadow-lg border-brand/20">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold text-[var(--brand)]">{bot.title}</CardTitle>
//               <CardDescription className="text-gray-600">{bot.desc}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white w-full">
//                 <Link href={bot.link} target="_blank">Open Chatbot</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default function HomePage() {
//   return (
//     <main className="min-h-screen flex flex-col">
//       {/* <Header /> */}
//       <ToolsSection />
//       <SMBoticsSection />
//       {/* <Footer /> */}
//     </main>
//   );
// }


// "use client";

// import { siteData } from "@/data/sections";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useRef, useEffect } from "react";
// import { Menu } from "lucide-react";

// export default function HomePage() {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <main className="min-h-screen font-poppins text-gray-800 bg-white">
//       {/* Header */}
//       <header className="flex justify-between items-center py-4 px-6 shadow-md relative z-50">
//         {/* Left: Brand */}
//         <h1
//           className="text-2xl font-bold text-[var(--brand)] cursor-pointer transition-transform duration-200 hover:scale-110"
//         >
//           Digital SM Studio
//         </h1>

//         {/* Center: Logo placeholder */}
//         <div className="text-gray-500 font-semibold text-sm">[Logo]</div>

//         {/* Right: Hamburger */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="text-[var(--brand)] hover:opacity-80 transition"
//         >
//           <Menu size={26} />
//         </button>

//         {/* Dropdown Menu */}
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               ref={menuRef}
//               initial={{ opacity: 0, scale: 0.95, y: -10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: -10 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="absolute right-6 top-[64px] w-64 bg-white border rounded-xl shadow-lg py-4 px-4 z-50"
//             >
//               <nav className="flex flex-col gap-4 text-gray-800 text-sm">
//                 {/* ToolWiz Section */}
//                 <div>
//                   <h3 className="text-[var(--brand)] font-semibold mb-1 text-base">
//                     {siteData.toolwiz.title}
//                   </h3>
//                   <div className="flex flex-col gap-1 ml-2">
//                     {siteData.toolwiz.tools.map((tool) => (
//                       <Link
//                         key={tool.id}
//                         href={tool.link}
//                         onClick={() => setOpen(false)}
//                         className="hover:text-[var(--brand)] transition"
//                       >
//                         {tool.name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 my-2"></div>

//                 {/* SMBotics Section */}
//                 <div>
//                   <h3 className="text-[var(--brand)] font-semibold mb-1 text-base">
//                     {siteData.smbotics.title}
//                   </h3>
//                   <div className="flex flex-col gap-1 ml-2">
//                     {siteData.smbotics.bots.map((bot, index) => (
//                       <Link
//                         key={index}
//                         href={bot.link}
//                         target="_blank"
//                         className="hover:text-[var(--brand)] transition"
//                       >
//                         {bot.name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </nav>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </header>

//       {/* ToolWiz Section */}
//       <section
//         id="toolwiz"
//         className="text-center py-16 px-6 md:px-12 lg:px-24 space-y-10"
//       >
//         <h2 className="text-3xl font-bold text-[var(--brand)]">
//           {siteData.toolwiz.title} — Useful Online Tools
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
//           {siteData.toolwiz.tools.map((tool) => (
//             <Card
//               key={tool.id}
//               className="w-80 border border-gray-200 hover:shadow-lg transition-shadow"
//             >
//               <CardHeader>
//                 <CardTitle className="text-[var(--brand)] text-lg">
//                   {tool.name}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600">{tool.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* SMBotics Section */}
//       <section
//         id="smbotics"
//         className="text-center py-16 px-6 md:px-12 lg:px-24 bg-gray-50 space-y-10"
//       >
//         <h2 className="text-3xl font-bold text-[var(--brand)]">
//           SMBotics — AI Agents that Automate and Engage
//         </h2>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           {siteData.smbotics.tagline}
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
//           {siteData.smbotics.bots.map((bot, index) => (
//             <Card
//               key={index}
//               className="w-80 border border-gray-200 hover:shadow-lg transition-shadow"
//             >
//               <CardHeader>
//                 <CardTitle className="text-[var(--brand)] text-lg">
//                   {bot.name}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Link
//                   href={bot.link}
//                   target="_blank"
//                   className="text-sm text-gray-600 hover:text-[var(--brand)] transition"
//                 >
//                   Visit Bot →
//                 </Link>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="text-center text-gray-600 py-6 border-t text-sm">
//         © {new Date().getFullYear()} Digital SM Studio. All rights reserved.
//       </footer>
//     </main>
//   );
// }


// src/app/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteData } from "@/data/sections";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

/**
 * Professional, responsive homepage.
 *
 * Notes:
 * - Card width is standardized with w-80 to match SMBotics.
 * - Gap and spacing use consistent Tailwind classes for all breakpoints.
 * - Dropdown animates with fade+scale.
 */

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const dropdownMotion = {
    initial: { opacity: 0, scale: 0.98, y: -6 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -6 },
    transition: { duration: 0.16, ease: "easeOut" },
  };

  const cardMotion = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.28, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-[var(--brand)]">
      <Header />

      {/* make room for fixed header; header height ~64px */}
      <main className="pt-24">
        {/* HERO / TOOLWIZ */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">
            {siteData.toolwiz.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            {siteData.toolwiz.subtitle}
          </p>

          {/* Tools grid - standardized card widths to match SMBotics */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {siteData.toolwiz.tools.map((tool, i) => (
              <Link href={tool.link} className="block w-80">
              <motion.div
                key={tool.id}
                // className="w-80"
                initial="initial"
                animate="animate"
                variants={cardMotion}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
                  {/* Icon gradient panel */}
                  <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center">
                    <div className="text-5xl text-white">{tool.icon}</div>
                  </div>

                  <CardContent className="p-6 text-left">
                    <CardTitle className="text-lg text-black">{tool.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600">
                      {tool.description}
                    </CardDescription>

                    <div className="mt-4">
                      {/* <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white w-full">
                        <Link href={tool.link}>Open</Link>
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* SMBotics */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black">
            {siteData.smbotics.title}
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            {siteData.smbotics.tagline}
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {siteData.smbotics.bots.map((bot, i) => (
              <motion.div
                key={bot.name}
                className="w-80"
                initial="initial"
                animate="animate"
                variants={cardMotion}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
                  <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center">
                    <div className="text-5xl text-white">{bot.icon}</div>
                  </div>

                  <CardContent className="p-6 text-left">
                    <CardTitle className="text-lg text-black">{bot.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600">
                    {bot.description}
                  </CardDescription>
                    <div className="mt-3">
                      <Link
                        href={bot.link}
                        target="_blank"
                        className="text-sm text-gray-600 hover:text-[var(--brand)]"
                      >
                        Visit Bot →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer: single instance */}
      <Footer />
    </div>
  );
}
