import Header from "@/components/Header";
import ScanForm from "@/components/ScanForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-[80px]" />
        </div>

        {/* Hero */}
        <section className="relative py-24 md:py-32 px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600/10 border border-brand-500/20 rounded-full text-brand-300 text-sm mb-8">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              登録不要・無料でスキャン
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            あなたのサイト、
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-brand-500 bg-clip-text text-transparent animate-gradient">
              リンク切れ
            </span>
            ありませんか？
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up delay-100" style={{ opacity: 0 }}>
            URLを入力するだけ。内部・外部リンクをすべてチェック。
            <br className="hidden md:block" />
            定期監視でSEO低下を防ぎましょう。
          </p>

          <div className="animate-slide-up delay-200" style={{ opacity: 0 }}>
            <ScanForm />
          </div>

          <p className="mt-6 text-sm text-gray-500 animate-fade-in delay-300" style={{ opacity: 0 }}>
            💡 30秒で結果表示 · 内部＆外部リンク対応 · 最大20ページをクロール
          </p>
        </section>

        {/* Features */}
        <section className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">
              なぜ<span className="text-brand-400">DeadLink</span>？
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
              シンプルで高速。必要な機能をすべて揃えました。
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "即スキャン",
                  desc: "URLを入れるだけで30秒以内に結果表示。登録不要で即使えます。",
                  gradient: "from-yellow-500/20 to-orange-500/20",
                },
                {
                  icon: "🔄",
                  title: "定期監視",
                  desc: "週1回（Proは毎日）自動チェック。リンク切れを見逃しません。",
                  gradient: "from-brand-500/20 to-purple-500/20",
                },
                {
                  icon: "🔔",
                  title: "即時通知",
                  desc: "メール・Discord・Slackで即通知。問題をすぐに修正できます。",
                  gradient: "from-emerald-500/20 to-teal-500/20",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-surface-100 border border-surface-300/50 rounded-2xl hover:border-brand-500/30 transition-all hover:shadow-xl hover:shadow-brand-500/5"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">
              <span className="text-brand-400">3ステップ</span>で完了
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "URLを入力", desc: "チェックしたいサイトのURLをペースト" },
                { step: "02", title: "自動スキャン", desc: "全ページをクロールし、リンクを一括チェック" },
                { step: "03", title: "結果確認", desc: "リンク切れ・リダイレクトを一覧で確認" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600/10 border border-brand-500/20 rounded-2xl mb-6">
                    <span className="text-brand-400 font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-br from-surface-100 to-surface-200 border border-surface-300/50 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-purple-600/5" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  定期監視を始めよう
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  無料プランでサイト1つ、週1回の自動チェック。
                </p>
                <a
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold text-lg hover:from-brand-500 hover:to-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/25 active:scale-[0.98]"
                >
                  無料で始める
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-surface-300/30 text-center text-sm text-gray-500">
          © 2025 DeadLink. All rights reserved.
        </footer>
      </main>
    </>
  );
}
