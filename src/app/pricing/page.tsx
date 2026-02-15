import Header from "@/components/Header";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-2">料金プラン</h1>
        <p className="text-center text-gray-600 mb-12">無料で始めて、必要に応じてアップグレード</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h2 className="text-xl font-bold mb-1">Free</h2>
            <div className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-500">/月</span></div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ サイト 1つ</li>
              <li>✅ 週1回チェック</li>
              <li>✅ メール通知</li>
              <li>✅ 直近1回分のレポート</li>
              <li>✅ 100ページ/サイト</li>
            </ul>
            <Link
              href="/auth/login"
              className="block w-full text-center py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
            >
              無料で始める
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white p-6 rounded-xl border-2 border-blue-600 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">おすすめ</span>
            <h2 className="text-xl font-bold mb-1">Pro</h2>
            <div className="text-3xl font-bold mb-4">$5<span className="text-base font-normal text-gray-500">/月</span></div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ サイト 3つ</li>
              <li>✅ 毎日チェック</li>
              <li>✅ メール + Discord + Slack通知</li>
              <li>✅ 過去30日分のレポート</li>
              <li>✅ 500ページ/サイト</li>
            </ul>
            <button
              disabled
              className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
