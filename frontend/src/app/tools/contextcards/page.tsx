'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

// Lazy-load for performance
const ContextCards = dynamic(() => import('@/components/toolwiz/ContextCards'), {
  ssr: false,
});

export default function ContextCardsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          ToolWiz — Useful Online Tools
        </h1>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
          <CardContent className="p-6">
            <ContextCards />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
