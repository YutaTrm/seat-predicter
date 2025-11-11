'use client'

import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import Footer from '../components/common/Footer';
import { GoogleAdsense } from '../components/common/GoogleAdsense';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      <GoogleAdsense />
      <SectionHeader title={t('terms.title')} />

      <p className="text-gray-600 leading-relaxed mb-8">
        {t('terms.intro')}
      </p>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section1.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section1.content')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section2.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section2.content')}
        <br />- {t('terms.section2.item1')}
        <br />- {t('terms.section2.item2')}
        <br />- {t('terms.section2.item3')}
        <br />- {t('terms.section2.item4')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section3.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section3.content')}
        <br />- {t('terms.section3.item1')}
        <br />- {t('terms.section3.item2')}
        <br />- {t('terms.section3.item3')}
        <br />- {t('terms.section3.item4')}
        <br />- {t('terms.section3.item5')}
        <br />- {t('terms.section3.item6')}
        <br />- {t('terms.section3.item7')}
        <br />- {t('terms.section3.item8')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section4.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section4.content')}
        <br />- {t('terms.section4.item1')}
        <br />- {t('terms.section4.item2')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section5.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section5.content')}
        <br />- {t('terms.section5.item1')}
        <br />- {t('terms.section5.item2')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section6.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section6.content')}
        <br />- {t('terms.section6.item1')}
        <br />- {t('terms.section6.item2')}
        <br />- {t('terms.section6.item3')}
        <br />- {t('terms.section6.item4').split('お問い合わせ')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('footer.contact')}</a>{t('terms.section6.item4').split('お問い合わせ')[1]}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section7.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section7.content')}
        <br />- {t('terms.section7.item1')}
        <br />- {t('terms.section7.item2')}
        <br />- {t('terms.section7.item3')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section8.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section8.content')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section9.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section9.content')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.section10.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.section10.content')}
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-lg text-rose-500 font-bold mb-2">{t('terms.contact.title')}</h2>
      <p className="text-gray-600 leading-relaxed mb-1">
        {t('terms.contact.content').split('こちら')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('about.here')}</a>{t('terms.contact.content').split('こちら')[1]}
      </p>
    </section>

    <Footer/>
  </main>
  );
}
