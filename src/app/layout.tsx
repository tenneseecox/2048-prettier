import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "2048 Prettier",
  description: "A beautifully designed version of the classic 2048 game",
  keywords: ["2048", "game", "puzzle", "modern", "prettier", "nextjs"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "2048 Prettier",
    description: "A beautifully designed version of the classic 2048 game",
    url: "https://2048-prettier.vercel.app/",
    siteName: "2048 Prettier",
    images: [
      {
        url: "https://2048-prettier.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "2048 Prettier",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-game-bg text-white`}
      >
        {children}
      </body>
    </html>
  );
}
