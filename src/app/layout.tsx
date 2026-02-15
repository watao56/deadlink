import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeadLink - リンク切れ自動検知",
  description: "Webサイトのリンク切れを自動で検知・通知。URLを入力するだけで即スキャン。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-white text-gray-900 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
