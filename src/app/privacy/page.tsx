import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import type { Metadata } from 'next';
import Footer from '../components/common/Footer';
import { GoogleAdsense } from '../components/common/GoogleAdsense';

export const metadata: Metadata = {
  title: 'ライセンス情報 | 座席予想掲示板',
  description: '座席予想掲示板のプライバシーポリシーについて',
};

export default function PrivacyPolicyPage() {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
        <GoogleAdsense />
        <SectionHeader title="プライバシーポリシー" />

        <p className="text-gray-600 leading-relaxed mb-8">
        当サイトでは、ユーザーの皆様に安心してご利用いただくため、以下のとおり個人情報の取り扱いについて定めます。
        </p>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">1.収集する情報</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは、以下の情報を収集します。
          </p>
          <p className="text-gray-600 leading-relaxed mb-1 ml-4">
            <strong>座席情報の投稿時：</strong>
            <br/>- アーティスト名、ツアー名、抽選枠、座席情報（ブロック、列、番号）
          </p>
          <p className="text-gray-600 leading-relaxed mb-1 ml-4">
            <strong>X（Twitter）ログイン時：</strong>
            <br/>- メールアドレス
            <br/>- ユーザー名（表示名）
            <br/>- プロフィール画像URL
            <br/>- Xのユーザーアカウント情報
          </p>
          <p className="text-gray-600 leading-relaxed mb-1 ml-4">
            <strong>自動的に収集される情報：</strong>
            <br/>- ログイン日時
            <br/>- アカウント作成日時
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">2.情報の利用目的</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            収集した情報は、以下の目的で使用いたします。
            <br />- ユーザーアカウントの管理・認証
            <br />- 座席情報の共有・表示
            <br />- マイページ機能の提供（投稿履歴の表示・削除）
            <br />- お問い合わせへの返信対応
            <br />- 利用状況の分析・サービス改善
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">3.第三者サービスへの情報提供</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは、以下の第三者サービスを利用しており、それらに情報を提供します。
          </p>
          <p className="text-gray-600 leading-relaxed mb-1 ml-4">
            <strong>X（Twitter）:</strong>
            <br/>- ログイン認証のため、Xの認証サービスを利用します
            <br/>- Xのプライバシーポリシーに従って情報が取り扱われます
          </p>
          <p className="text-gray-600 leading-relaxed mb-1 ml-4">
            <strong>Supabase:</strong>
            <br/>- ユーザー認証およびデータベース管理のため利用します
            <br/>- 収集した個人情報は、適切なセキュリティ対策のもと保管されます
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">4.個人情報の保存期間と管理</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            - アカウント情報は、ユーザーがアカウントを削除するまで保存されます
            <br/>- 投稿されたチケット情報は、ユーザー自身がマイページから削除することができます
            <br/>- 長期間利用がないアカウントについては、予告なく削除する場合があります
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">5.セキュリティ対策</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは、個人情報の保護のため、以下のセキュリティ対策を実施しています。
            <br/>- SSL/TLS暗号化通信の使用
            <br/>- 第三者による不正アクセスの防止
            <br/>- 認証情報の適切な管理
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">6.ユーザーの権利</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            ユーザーは、自身の個人情報について以下の権利を有します。
            <br/>- 個人情報の開示、訂正、削除の請求
            <br/>- 投稿したチケット情報の削除（マイページから実施可能）
            <br/>- アカウントの削除（<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>お問い合わせ</a>よりご連絡ください）
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">7.広告について</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトでは第三者配信の広告サービスを利用する予定です。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">8.アクセス解析ツールについて</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
          当サイトでは、Google Analyticsなどのアクセス解析ツールを使用することがあります。これにより収集されるデータは匿名であり、個人を特定するものではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">9.免責事項</h2>
          <p className="text-gray-600 leading-relaxed mb-1">
            当サイトに掲載された情報によって発生した損害等については一切責任を負いかねます。情報の正確性や安全性には十分注意しておりますが、利用はご自身の判断でお願いいたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg text-rose-500 font-bold mb-2">10.プライバシーポリシーの変更</h2>
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