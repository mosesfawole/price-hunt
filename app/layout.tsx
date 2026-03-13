import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PriceHunt — Compare Prices Instantly",
  description:
    "Search any product and find the lowest prices across multiple retailers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const s = JSON.parse(localStorage.getItem('price-hunt-storage') || '{}');
              if (s.state?.isDark !== false) document.documentElement.classList.add('dark');
            } catch(e) {}
          `,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${jetbrains.variable} font-mono min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
