'use client';

import React from 'react';

/**
 * ContextCardsClientWrapper
 * Client-side wrapper to ensure components using browser APIs (like localStorage or chrome)
 * only render on the client.
 */
interface WrapperProps {
  children: React.ReactNode;
}

export default function ContextCardsClientWrapper({ children }: WrapperProps): JSX.Element {
  // Prevent SSR mismatch by ensuring it's only rendered on client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div />; // nothing rendered on server

  // ✅ Renders exactly what was passed, preserving layout
  return <>{children}</>;
}
