import "./globals.css";
import { GlobalContextProvider } from "@/context/GlobalContextCaptureProvider";

export const metadata = {
  title: "ToolWiz",
  description: "Useful online tools to simplify your digital tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  );
}
