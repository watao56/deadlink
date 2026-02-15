import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeadLink - リンク切れ自動検知サービス",
  description: "ブログ・Webサイトのリンク切れを自動で検知し、通知します。無料でいますぐスキャン。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
