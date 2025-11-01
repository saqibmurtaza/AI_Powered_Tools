"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteData } from "@/data/sections";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

/**
 * ✅ Restored version — original layout, animations, and design.
 * ToolWiz and SMBotics cards display correctly.
 * No context-capture or ContextCards logic included.
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

  const cardMotion = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.28, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-[var(--brand)]">
      <Header />

      {/* Spacing for fixed header */}
      <main className="pt-24">
        {/* TOOLWIZ Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">
            {siteData.toolwiz.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            {siteData.toolwiz.subtitle}
          </p>
          

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {siteData.toolwiz.tools.map((tool, i) => (
              <motion.div
                key={tool.id || i}
                initial="initial"
                animate="animate"
                variants={cardMotion}
                transition={{ delay: i * 0.05 }}
                className="w-80"
              >
                <Link href={tool.link} className="block">
                  <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
                    {/* Icon section */}
                    <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center">
                      <div className="text-5xl text-white">{tool.icon}</div>
                    </div>

                    <CardContent className="p-6 text-left">
                      <CardTitle className="text-lg text-black">{tool.name}</CardTitle>
                      <CardDescription className="mt-2 text-sm text-gray-600">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Adsterra AD Button */}

      <div className="flex flex-col items-center gap-4 mb-3">
        <div className="adsterra-monetization flex flex-col items-center gap-4 bg-purple-200 border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 mt-6 text-left max-w-2xl">
            <p className="monetization-note text-gray-600 text-sm max-w-sm text-center">
                "We monetise this site with non-intrusive ads via Adsterra, which helps keep the tool free and maintained"
            </p>
            <button
                className="smartlink-btn inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
                onClick={() => window.open('https://www.effectivegatecpm.com/y83y6xhhp?key=7438c8e0613e1d38069c5df5f868a451')}
                title="Clicking supports our free service through non-intrusive ads"
            >
                Continue to Content
            </button>
        </div>
      </div>

        {/* SMBOTICS Section */}
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
                key={bot.name || i}
                className="w-80"
                initial="initial"
                animate="animate"
                variants={cardMotion}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={bot.link} className="block">
                  <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer">
                    <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center">
                      <div className="text-5xl text-white">{bot.icon}</div>
                    </div>

                    <CardContent className="p-6 text-left">
                      <CardTitle className="text-lg text-black">{bot.name}</CardTitle>
                      <CardDescription className="mt-2 text-sm text-gray-600">
                        {bot.description}
                      </CardDescription>
                      {/* Removed the "Visit Bot" link and arrow */}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
