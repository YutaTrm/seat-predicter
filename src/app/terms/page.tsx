import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import type { Metadata } from 'next';
import Footer from '../components/common/Footer';

export const metadata: Metadata = {
  title: 'ライセンス情報 | 座席予想掲示板',
  description: '座席予想掲示板の利用規約について',
};

export default function TermsPage() {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
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
        <h2 className="text-lg text-rose-500 font-bold mb-2">2.禁止事項</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          ユーザーは、以下の行為を行ってはなりません。
          <br />- 他者の個人情報を含む投稿
          <br />- 虚偽または誤解を与える情報の投稿
          <br />- 著作権、肖像権など他者の権利を侵害する行為
          <br />- 公序良俗に反する行為
          <br />- 不正アクセス、スパム行為等
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">3.投稿された情報の取り扱い</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          ユーザーが投稿した座席情報等のデータは、当サイト上で公開される可能性があることを予めご了承ください。投稿内容に関する責任は投稿者に帰属します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">4.サービス内容の変更・中止</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスは予告なく内容の変更、または停止・終了することがあります。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">5.免責事項</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          本サービスを利用することによって発生したいかなる損害についても、当サイトは一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">6.本規約の変更</h2>
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