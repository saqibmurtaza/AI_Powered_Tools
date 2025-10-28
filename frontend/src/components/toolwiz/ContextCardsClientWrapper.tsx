// frontend/src/components/toolwiz/ContextCardsClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the existing client ContextCards component (no SSR)
const ContextCardsClient = dynamic(() => import('./ContextCards'), { ssr: false });

export default function ContextCardsClientWrapper(): JSX.Element {
  return <ContextCardsClient />;
}
