'use client';

import dynamic from 'next/dynamic';

// Import the ClientPage with no SSR to avoid hydration issues
const ClientPage = dynamic(() => import('@/app/tools/contextcards/ClientPage'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-pulse">Loading Context Cards...</div>
    </div>
  )
});

export default function ContextCardsWrapper() {
  return <ClientPage />;
}