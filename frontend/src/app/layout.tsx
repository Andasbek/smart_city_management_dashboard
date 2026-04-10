import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Управление Смарт-Сити",
  description: "Аналитическая панель управления городом на базе AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <AppHeader />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
