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
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">🔗 DeadLink</Link>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">料金</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">ダッシュボード</Link>
              <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">設定</Link>
              <button onClick={() => supabase.auth.signOut().then(() => setUser(null))} className="text-sm text-gray-600 hover:text-gray-900">ログアウト</button>
            </>
          ) : (
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">ログイン</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
