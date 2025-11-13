'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutSite() {
  const { t } = useLanguage()

  return (
    <>
      <h2 className="text-lg text-gray-600 font-bold mb-2">{t('home.aboutSite.title')}</h2>
      <div className="p-4 border rounded bg-white text-gray-600 text-sm leading-relaxed space-y-4">
        <div>
          <h3 className="font-bold text-rose-500 mb-1">{t('home.aboutSite.overview')}</h3>
          <p>
            {t('home.aboutSite.description')}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-rose-500 mb-1">{t('home.aboutSite.features')}</h3>
          <p className="mb-2">
            {t('home.aboutSite.howItHelps')}
          </p>
          <p>
            {t('home.aboutSite.accountLink')}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-rose-500 mb-1">{t('home.aboutSite.usage')}</h3>
          <p>
            {t('home.aboutSite.howToUse')}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-rose-500 mb-1">{t('home.aboutSite.faq')}</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num}>
                <p className="text-gray-700 -indent-7 pl-7"><span className="font-bold text-rose-500">Q{num}.</span> {t(`home.aboutSite.faqQ${num}`).replace(/^Q\d+\.\s*/, '')}</p>
                <p className="-indent-7 pl-7"><span className="font-bold text-rose-500">A{num}.</span> {t(`home.aboutSite.faqA${num}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
