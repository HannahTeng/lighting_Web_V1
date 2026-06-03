import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orikami Studio — Folded Light",
  description:
    "Sculptural paper lighting, shipped flat, folded by you. Designed in Kyoto. Finished by hand.",
  openGraph: {
    title: "Orikami Studio — Folded Light",
    description: "Sculptural paper lighting, shipped flat, folded by you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body
        className="min-h-screen"
        style={{ fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
