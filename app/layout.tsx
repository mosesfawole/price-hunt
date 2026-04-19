import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PriceHunt | Match-Aware Price Comparison",
  description:
    "Compare Google Shopping listings with match confidence, filter noisy variants, and review cached search freshness before you click through.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storage = JSON.parse(localStorage.getItem('price-hunt-storage') || '{}');
                if (storage.state?.isDark === true) {
                  document.documentElement.classList.add('dark');
                }
              } catch (error) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
