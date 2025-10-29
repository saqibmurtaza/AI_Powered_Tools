"use client";

import dynamic from "next/dynamic";
import React from "react";

// ✅ Client-only dynamic import
const ClientPage = dynamic(() => import("./ClientPage"), { ssr: false });

export default function ClientWrapper() {
  return <ClientPage />;
}
