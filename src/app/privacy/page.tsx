'use client'

import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import Footer from '../components/common/Footer';
import { GoogleAdsense } from '../components/common/GoogleAdsense';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      <GoogleAdsense />
      <SectionHeader title={t('privacy.title')} />

      <p className="text-gray-600 leading-relaxed mb-8">
        {t('privacy.intro')}
      </p>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section1.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section1.content')}
        </p>
        <p className="text-gray-600 leading-relaxed mb-1 ml-4">
          <strong>{t('privacy.section1.posting.title')}</strong>
          <br/>- {t('privacy.section1.posting.content')}
        </p>
        <p className="text-gray-600 leading-relaxed mb-1 ml-4">
          <strong>{t('privacy.section1.login.title')}</strong>
          <br/>- {t('privacy.section1.login.item1')}
          <br/>- {t('privacy.section1.login.item2')}
          <br/>- {t('privacy.section1.login.item3')}
          <br/>- {t('privacy.section1.login.item4')}
        </p>
        <p className="text-gray-600 leading-relaxed mb-1 ml-4">
          <strong>{t('privacy.section1.auto.title')}</strong>
          <br/>- {t('privacy.section1.auto.item1')}
          <br/>- {t('privacy.section1.auto.item2')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section2.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section2.content')}
          <br />- {t('privacy.section2.item1')}
          <br />- {t('privacy.section2.item2')}
          <br />- {t('privacy.section2.item3')}
          <br />- {t('privacy.section2.item4')}
          <br />- {t('privacy.section2.item5')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section3.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section3.content')}
        </p>
        <p className="text-gray-600 leading-relaxed mb-1 ml-4">
          <strong>{t('privacy.section3.twitter.title')}</strong>
          <br/>- {t('privacy.section3.twitter.item1')}
          <br/>- {t('privacy.section3.twitter.item2')}
        </p>
        <p className="text-gray-600 leading-relaxed mb-1 ml-4">
          <strong>{t('privacy.section3.supabase.title')}</strong>
          <br/>- {t('privacy.section3.supabase.item1')}
          <br/>- {t('privacy.section3.supabase.item2')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section4.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          - {t('privacy.section4.item1')}
          <br/>- {t('privacy.section4.item2')}
          <br/>- {t('privacy.section4.item3')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section5.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section5.content')}
          <br/>- {t('privacy.section5.item1')}
          <br/>- {t('privacy.section5.item2')}
          <br/>- {t('privacy.section5.item3')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section6.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section6.content')}
          <br/>- {t('privacy.section6.item1')}
          <br/>- {t('privacy.section6.item2')}
          <br/>- {t('privacy.section6.item3').split('お問い合わせ')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('footer.contact')}</a>{t('privacy.section6.item3').split('お問い合わせ')[1]}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section7.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section7.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section8.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section8.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section9.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section9.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.section10.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.section10.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('privacy.contact.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('privacy.contact.content').split('こちら')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('about.here')}</a>{t('privacy.contact.content').split('こちら')[1]}
        </p>
      </section>

      <Footer/>
    </main>
  );
}
