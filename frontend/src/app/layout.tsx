// // frontend/src/app/layout.tsx (Server Component)
// import './globals.css';
// import React from 'react';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';

// export const metadata = {
//   title: 'Digital SM Studio',
//   description: 'Building the Future of Agentic AI',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased min-h-screen">
//         <div className="min-h-screen bg-white">
//           <Header />
//           <main>{children}</main>
//           <Footer />
//         </div>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital SM Studio",
  description: "AI tools and automation suite by Digital SM Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
