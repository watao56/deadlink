"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function SettingsPage() {
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (profile) {
        setNotificationEmail(profile.notification_email ?? true);
        setDiscordWebhook(profile.discord_webhook || "");
        setSlackWebhook(profile.slack_webhook || "");
      }
    });
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").upsert({
      id: user.id,
      notification_email: notificationEmail,
      discord_webhook: discordWebhook || null,
      slack_webhook: slackWebhook || null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">通知設定</h1>
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border space-y-6">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notificationEmail} onChange={(e) => setNotificationEmail(e.target.checked)} className="w-4 h-4" />
              <span className="font-medium">メール通知</span>
            </label>
            <p className="text-sm text-gray-500 ml-7">リンク切れ検出時にメールで通知</p>
          </div>
          <div>
            <label className="block font-medium mb-1">Discord Webhook URL</label>
            <input type="url" placeholder="https://discord.com/api/webhooks/..." value={discordWebhook} onChange={(e) => setDiscordWebhook(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm" />
            <p className="text-sm text-gray-500 mt-1">Proプランで利用可能</p>
          </div>
          <div>
            <label className="block font-medium mb-1">Slack Webhook URL</label>
            <input type="url" placeholder="https://hooks.slack.com/services/..." value={slackWebhook} onChange={(e) => setSlackWebhook(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm" />
            <p className="text-sm text-gray-500 mt-1">Proプランで利用可能</p>
          </div>
          <div>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? "保存中..." : "保存"}
            </button>
            {saved && <span className="ml-3 text-green-600 text-sm">✓ 保存しました</span>}
          </div>
        </form>
      </main>
    </>
  );
}
