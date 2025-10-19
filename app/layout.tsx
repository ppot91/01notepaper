import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-georgia"
});

export const metadata: Metadata = {
  title: "NotePaper",
  description: "Minimalist, newspaper-inspired note-taking app."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
