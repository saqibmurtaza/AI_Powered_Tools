import React from "react";
import dynamic from "next/dynamic";

// Dynamically import client component without SSR
const ClientPage = dynamic(() => import("./ClientPage"), { ssr: false });

export default function ServerPage() {
  return <ClientPage />;
}
