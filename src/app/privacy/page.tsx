import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import type { Metadata } from 'next';
import Footer from '../components/common/Footer';

export const metadata: Metadata = {
  title: 'ライセンス情報 | 座席予想掲示板',
  description: '座席予想掲示板のプライバシーポリシーについて',
};

export default function PrivacyPolicyPage() {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
        <SectionHeader title="プライバシーポリシー" />

        <p className="text-gray-600 leading-relaxed mb-8">
        当サイトでは、ユーザーの皆様に安心してご利用いただくため、以下のとおり個人情報の取り扱いについて定めます。
        </p>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">1.収集する情報</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは、座席情報の投稿の際に、ユーザーから以下の情報を収集します。
            <br/>- アーティスト名、ツアー名、抽選枠、座席情報（個人を特定しない範囲）
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">2.情報の利用目的</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            収集した情報は、以下の目的で使用いたします。
            <br />- 座席情報の共有・表示
            <br />- お問い合わせへの返信対応
            <br />- 利用状況の分析・サービス改善
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">3.広告について</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは第三者配信の広告サービスを利用する予定です。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">4.アクセス解析ツールについて</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
          当サイトでは、Google Analyticsなどのアクセス解析ツールを使用することがあります。これにより収集されるデータは匿名であり、個人を特定するものではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">5.免責事項</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトに掲載された情報によって発生した損害等については一切責任を負いかねます。情報の正確性や安全性には十分注意しておりますが、利用はご自身の判断でお願いいたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">6.プライバシーポリシーの変更</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            本ポリシーの内容は予告なく変更されることがあります。変更後の内容は本ページにて掲載します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">お問い合わせ先</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            本規約に関するお問い合わせは、<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>こちら</a>よりご連絡ください。
          </p>
        </section>

        <Footer/>
      </main>
    );
  }