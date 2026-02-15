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
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-base font-semibold text-gray-900 tracking-tight">
          DeadLink
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            料金
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                設定
              </Link>
              <button
                onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
