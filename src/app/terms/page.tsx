import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import type { Metadata } from 'next';
import Footer from '../components/common/Footer';
import { GoogleAdsense } from '../components/common/GoogleAdsense';

export const metadata: Metadata = {
  title: 'ライセンス情報 | 座席予想掲示板',
  description: '座席予想掲示板の利用規約について',
};

export default function TermsPage() {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
        <GoogleAdsense />
        <SectionHeader title="利用規約" />

        <p className="text-gray-600 leading-relaxed mb-8">
          この利用規約（以下、「本規約」といいます）は、当サイトの提供するサービス（以下、「本サービス」といいます）の利用条件を定めるものです。ご利用いただく前に本規約をご確認ください。
        </p>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">1.利用目的</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスは、コンサート等のチケット座席情報を共有し、構成予想等の参考とすることを目的としています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">2.アカウント登録・ログイン</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスの一部機能（マイページ、投稿の管理等）を利用するには、X（Twitter）アカウントでのログインが必要です。
          <br />- ログインには、X（Twitter）の認証サービスを使用します
          <br />- ログイン時、X（Twitter）の利用規約およびプライバシーポリシーに同意したものとみなします
          <br />- ログインすることで、本規約およびプライバシーポリシーに同意したものとみなします
          <br />- ログインなしでも、チケット情報の閲覧や投稿は可能です
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">3.禁止事項</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          ユーザーは、以下の行為を行ってはなりません。
          <br />- 他者の個人情報を含む投稿
          <br />- 虚偽または誤解を与える情報の投稿
          <br />- 著作権、肖像権など他者の権利を侵害する行為
          <br />- 公序良俗に反する行為
          <br />- 不正アクセス、スパム行為等
          <br />- 他者のアカウントを不正に使用する行為
          <br />- アカウント情報を第三者に譲渡または貸与する行為
          <br />- 複数アカウントの作成による不正利用
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">4.アカウントの管理責任</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          ユーザーは、自身のアカウント情報の管理について責任を負うものとします。
          <br />- アカウントの不正使用による損害について、当サイトは一切責任を負いません
          <br />- 第三者によるアカウントの不正使用が判明した場合、速やかに当サイトにご連絡ください
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">5.投稿された情報の取り扱い</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          ユーザーが投稿した座席情報等のデータは、当サイト上で公開される可能性があることを予めご了承ください。投稿内容に関する責任は投稿者に帰属します。
          <br />- ログインユーザーは、マイページから自身の投稿を削除することができます
          <br />- 削除された投稿は復元できませんのでご注意ください
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">6.アカウントの削除・停止</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          以下の場合、当サイトはユーザーのアカウントを削除または停止することがあります。
          <br />- 本規約に違反した場合
          <br />- 長期間利用がない場合
          <br />- その他、当サイトが不適切と判断した場合
          <br />- ユーザー自身がアカウント削除を希望する場合は、<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>お問い合わせ</a>よりご連絡ください
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">7.第三者サービスの利用</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスでは、以下の第三者サービスを利用しています。
          <br />- X（Twitter）: ログイン認証
          <br />- Supabase: ユーザー認証およびデータ管理
          <br />これらのサービスの利用規約およびプライバシーポリシーにも従っていただく必要があります。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">8.サービス内容の変更・中止</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスは予告なく内容の変更、または停止・終了することがあります。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">9.免責事項</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスを利用することによって発生したいかなる損害についても、当サイトは一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">10.本規約の変更</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本規約は予告なく変更されることがあります。最新の内容は当ページにて掲載いたします。
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