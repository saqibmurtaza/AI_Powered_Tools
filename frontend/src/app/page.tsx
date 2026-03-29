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
                <Link href={tool.link} className="block h-full">
                  <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 h-full flex flex-col">
                    {/* Icon section */}
                    <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                      <div className="text-5xl text-white">{tool.icon}</div>
                    </div>

                    <CardContent className="p-6 text-left flex flex-col flex-grow">
                      <CardTitle className="text-lg text-black flex-shrink-0">{tool.name}</CardTitle>
                      {/* Fixed height description area with hover reveal */}
                      <div className="relative group mt-2">
                        <CardDescription className="text-sm text-gray-600 whitespace-pre-line line-clamp-3 group-hover:line-clamp-none transition-all duration-200">
                          {tool.description}
                        </CardDescription>
                        {/* Fade effect indicator for long text */}
                        {tool.description && tool.description.length > 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent group-hover:opacity-0 transition-opacity duration-200 pointer-events-none"></div>
                        )}
                      </div>
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
              &quot;We monetise this site with non-intrusive ads via Adsterra, which helps keep the tool free and maintained&quot;
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

        {/* SMBOTICS Section - Fixed with same card height consistency */}
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
                <Link href={bot.link} className="block h-full">
                  <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="h-28 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                      <div className="text-5xl text-white">{bot.icon}</div>
                    </div>

                    <CardContent className="p-6 text-left flex flex-col flex-grow">
                      <CardTitle className="text-lg text-black flex-shrink-0">{bot.name}</CardTitle>
                      {/* Fixed height description area with hover reveal */}
                      <div className="relative group mt-2">
                        <CardDescription className="text-sm text-gray-600 whitespace-pre-line line-clamp-3 group-hover:line-clamp-none transition-all duration-200">
                          {bot.description}
                        </CardDescription>
                        {/* Fade effect indicator for long text - using gray-50 to match section background */}
                        {bot.description && bot.description.length > 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent group-hover:opacity-0 transition-opacity duration-200 pointer-events-none"></div>
                        )}
                      </div>
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