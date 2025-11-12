'use client'

import React from 'react';
import Link from 'next/link';
import SectionHeader from '../components/common/SectionHeader';
import Footer from '../components/common/Footer';
import { GoogleAdsense } from '../components/common/GoogleAdsense';
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
      <GoogleAdsense />
      <SectionHeader title={t('about.title')} />

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('about.overview')}</h2>
        <p className="text-gray-600 leading-relaxed mb-1">
          {t('about.overviewText')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('about.howToUse')}</h2>
        <ul className="list-disc list-outside text-gray-600 space-y-1 ml-[1em]">
          <li dangerouslySetInnerHTML={{ __html: t('about.howToUseList1').replace(/「([^」]+)」/g, '<b>$1</b>') }} />
          <li style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: t('about.howToUseList2').replace(/「([^」]+)」/g, '<b>$1</b>').replace(/※([^。]+)。/g, '<br/>※<b>$1</b>。') }} />
          <li dangerouslySetInnerHTML={{ __html: t('about.howToUseList3').replace(/並べ替える/g, '<b>並べ替える</b>') }} />
          <li>
            {t('about.howToUseList4').split('こちら')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('about.here')}</a>{t('about.howToUseList4').split('こちら')[1]}
          </li>
          <p className='text-xs bg-rose-100 border-rose-300 p-2' style={{ whiteSpace: 'pre-line' }}>
            {t('about.requestFormat')}
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('about.management')}</h2>
        <ul className="list-disc list-outside text-gray-600 space-y-1 ml-[1em]">
          <li>{t('about.managementList1')}</li>
          <li>{t('about.managementList2')}</li>
          <li>{t('about.managementList3').split('ライセンス')[0]}<Link href="/license" className="underline text-rose-700 hover:text-rose-900 transition-colors">{t('footer.license')}</Link>{t('about.managementList3').split('ライセンス')[1]}</li>
        </ul>
      </section>

      <section className='mb-8'>
        <h2 className="text-lg text-rose-500 font-bold mb-2">{t('about.notes')}</h2>
        <p className="text-gray-600 leading-relaxed">
          {t('about.notesText').split('こちら')[0]}<a className='underline text-rose-700 hover:text-rose-900 transition-colors' href='https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header' target='_blank'>{t('about.here')}</a>{t('about.notesText').split('こちら')[1]}
        </p>
      </section>
      <Footer/>
    </main>
  );
}
