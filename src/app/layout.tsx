import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeadLink - リンク切れ自動検知サービス",
  description: "ブログ・Webサイトのリンク切れを自動で検知し、通知します。無料でいますぐスキャン。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.className} bg-surface-50 text-gray-100 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
