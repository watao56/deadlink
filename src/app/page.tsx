import Header from "@/components/Header";
import ScanForm from "@/components/ScanForm";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              サイトのリンク切れを検知する
            </h1>
            <p className="text-base text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
              URLを入力するだけで、サイト内のすべてのリンクをチェック。
              内部リンク・外部リンクの両方を検出します。
            </p>
            <ScanForm />
            <p className="mt-4 text-xs text-gray-400">
              登録不要 · 最大20ページをクロール · 約30秒で完了
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm mb-3">
                  ⚡
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">即時スキャン</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  URLを入力するだけ。登録やインストールは不要です。
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm mb-3">
                  🔄
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">定期監視</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  アカウント登録で週次・日次の自動チェックを設定できます。
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm mb-3">
                  🔔
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">通知連携</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  メール・Discord・Slackにリンク切れを通知します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-gray-100">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">定期監視を設定する</h2>
            <p className="text-sm text-gray-500 mb-6">
              アカウントを作成すると、サイトの定期チェックと通知を利用できます。
            </p>
            <a
              href="/auth/login"
              className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              アカウント作成
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2025 DeadLink
        </footer>
      </main>
    </>
  );
}
