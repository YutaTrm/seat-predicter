import React from 'react';
import Link from 'next/link';
import SectionHeader from '../components/common/SectionHeader';
import Footer from '../components/common/Footer';

export default function AboutPage() {
  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      <SectionHeader title="座席予想掲示板について" />

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">アプリの概要</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          座席予想掲示板は、ライブのチケット番号を登録/一覧化してブロックの情報を可視化するアプリです。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">使い方</h2>
        <ul className="list-disc list-outside text-gray-600 space-y-1 ml-[1em]">
          <li>アーティストとツアーを選択して「一覧」ボタンを押すと、データベースに登録された<b>チケット情報を一覧</b>で見ることができます。</li>
          <li>チケット情報を入力して「登録」ボタンを押すと<b>データベースに登録</b>することができます。<br/>
              ※一度登録したチケット情報は<b>削除できません</b>。</li>
          <li>出てきた一覧は他の人達が登録済みの情報です。表の上部の項目名の矢印を押すと、列を<b>並べ替える</b>ことができます。</li>
          <li>
            アーティストやツアーは<b>管理者が登録</b>します。追加を希望される方は<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>こちら</a>から要望をお願いします。その際は以下のような情報で頂けると登録がスムーズです。
          </li>
          <p className='text-xs bg-rose-100 border-rose-300 p-2'>
            アーティスト名<br/>
              　┗ツアー名[開催都道府県]<br/>
              　┗チケット種別(◯◯会員/◯◯モバイル/注釈付き 等)
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">本アプリの運営</h2>
        <ul className="list-disc list-outside text-gray-600 space-y-1 ml-[1em]">
          <li>誰でも気軽に無料で使えることをコンセプトにしています。</li>
          <li>運営にはサーバー設置費、URL取得費、データベース月額費がかかるため、これらを賄うために広告を設置しています。</li>
          <li>本アプリのライセンス情報は<Link href="/license" className="underline text-rose-700 hover:text-rose-900 transition-colors">ライセンス</Link>をご確認ください。</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className="text-lg text-rose-500 font-bold mb-2">注意事項</h2>
        <p className="text-gray-600 leading-relaxed">
          本アプリについて改善提案や要望などありましたら<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>こちら</a>から連絡お願いします。
        </p>
      </section>
      <Footer/>
    </main>
  );
}