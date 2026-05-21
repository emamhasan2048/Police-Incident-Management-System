import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Future Cases",
  description: "Traffic violation case registry backed by MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <footer className="border-t border-zinc-200 px-6 py-6 text-center text-sm font-bold text-zinc-500">
          Developed by Hasan Emam
        </footer>
      </body>
    </html>
  );
}
