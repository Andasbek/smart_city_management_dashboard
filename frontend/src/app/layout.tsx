import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Main Content Area */}
          <main style={{ flex: 1, padding: "30px", overflowY: "auto", maxWidth: "1600px", margin: "0 auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
