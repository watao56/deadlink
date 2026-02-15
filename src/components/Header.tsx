"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  return (
    <header className="border-b border-surface-300/50 bg-surface-100/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white text-sm">
            🔗
          </span>
          <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
            DeadLink
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            料金
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                ダッシュボード
              </Link>
              <Link href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors">
                設定
              </Link>
              <button
                onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
