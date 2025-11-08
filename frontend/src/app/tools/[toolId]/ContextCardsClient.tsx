'use client';

import dynamic from 'next/dynamic';

// Import the ClientPage with no SSR to avoid hydration issues
const ClientPage = dynamic(() => import('@/app/tools/contextcards/ClientPage'), {
  ssr: false
});

export default function ContextCardsClient() {
  return <ClientPage />;
}