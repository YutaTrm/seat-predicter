import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">ライブ座席予想について</h1>

      <section className="mb-8">
        <h2 className="text-lg text-gray-900 font-bold mb-2">アプリの概要</h2>
        <p className="text-gray-700 leading-relaxed mb-1">
          ライブ座席予想は、チケット番号を登録/一覧化しブロックの情報を可視化するアプリです。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-gray-900 font-bold mb-2">使い方</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>入力欄にチケット情報を入力するとデータベースに登録することができます。</li>
          <li>ツアー名まで入力して「一覧」ボタンを押すと、データベースに登録されたチケット情報を一覧で見ることができます。</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 font-bold mb-2">注意事項</h2>
        <p className="text-gray-700 leading-relaxed">
          本アプリのデータは開発中です。改善提案や要望などあったらトップページ下部の「問い合わせ」まで連絡お願いします。
        </p>
      </section>
    </div>
  );
}