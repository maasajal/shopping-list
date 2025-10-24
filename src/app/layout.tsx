import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Shopping List",
  description: "Your personal shopping list with QR code sharing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        data-new-gr-c-s-check-loaded="8.934.0"
        data-gr-ext-installed=""
      >
        {children}
      </body>
    </html>
  );
}
