import Header from "@/components/Header";
import ScanForm from "@/components/ScanForm";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            あなたのサイト、<br />
            <span className="text-blue-600">リンク切れ</span>ありませんか？
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            URLを入力するだけ。登録不要・無料でリンク切れを即チェック。
            <br />
            定期監視で、SEO低下を防ぎましょう。
          </p>
          <ScanForm />
          <p className="mt-4 text-sm text-gray-400">
            登録不要・無料で即スキャン。30秒で結果が出ます。
          </p>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">即スキャン</h3>
              <p className="text-gray-600 text-sm">URLを入れるだけで30秒以内に結果を表示。登録不要です。</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-lg mb-2">定期監視</h3>
              <p className="text-gray-600 text-sm">週1回（Proは毎日）自動チェック。リンク切れを見逃しません。</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="font-semibold text-lg mb-2">通知</h3>
              <p className="text-gray-600 text-sm">メール・Discord・Slackで即通知。すぐに修正できます。</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">定期監視を始めよう</h2>
          <p className="text-gray-600 mb-6">無料プランでサイト1つ、週1回の自動チェック。</p>
          <a
            href="/auth/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            無料で始める
          </a>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-200 text-center text-sm text-gray-400">
          © 2025 DeadLink. All rights reserved.
        </footer>
      </main>
    </>
  );
}
