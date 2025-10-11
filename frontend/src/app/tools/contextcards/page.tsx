"use client";

import React, { useEffect, useState } from "react";
import { Search, Tag, Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface ContextCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ContextCardsPage() {
  const [cards, setCards] = useState<ContextCard[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Load cards from localStorage safely
  useEffect(() => {
    try {
      const raw = localStorage.getItem("context-cards");
      if (raw) setCards(JSON.parse(raw));
    } catch {
      console.warn("Failed to load context-cards");
    }
  }, []);

  // ✅ Save cards
  useEffect(() => {
    try {
      localStorage.setItem("context-cards", JSON.stringify(cards));
    } catch (e) {
      console.warn("Failed to save context-cards", e);
    }
  }, [cards]);

  const filtered = cards.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b18] via-[#111122] to-[#18182a] text-white font-poppins px-6 md:px-12 py-20">
      <div className="max-w-5xl mx-auto">
        {/* --- Header --- */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#7C3AED] to-[#4D0682] bg-clip-text text-transparent mb-8">
          ToolWiz — Context Cards
        </h1>

        {/* --- Toolbar Card --- */}
        <Card className="bg-[#1b1b2f]/80 border border-white/10 shadow-lg backdrop-blur-lg p-6 rounded-2xl mb-12">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="flex items-center w-full md:w-1/2 bg-[#0e0e1e] rounded-xl px-4 py-2 border border-white/10">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search title, description, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="bg-[#7C3AED] hover:bg-[#5B21B6] rounded-xl flex items-center gap-2">
                <Plus size={16} /> Add
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-xl flex items-center gap-2"
              >
                <Download size={16} /> Export
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-xl flex items-center gap-2"
              >
                <Upload size={16} /> Import
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* --- Tags Row --- */}
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">Tags:</span>
          <Button
            variant="outline"
            className="h-7 px-3 border-white/20 text-white hover:bg-white/10 rounded-xl text-xs"
          >
            All
          </Button>
        </div>

        {/* --- Cards Grid --- */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">
              No context cards match your search — create one to get started.
            </p>
            <p className="text-sm mt-2">
              Tech-savvy, extendable, and ready to integrate.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((card) => (
              <Card
                key={card.id}
                className="bg-[#1b1b2f]/70 border border-white/10 shadow-md hover:shadow-xl hover:border-[#7C3AED]/50 transition-all duration-200 rounded-2xl"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm line-clamp-3">
                    {card.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {card.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-[#7C3AED]/20 text-[#C4B5FD] px-2 py-1 rounded-lg"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
