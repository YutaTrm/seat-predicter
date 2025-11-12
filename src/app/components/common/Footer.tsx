'use client'

import Link from "next/link"
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * フッターコンポーネント
 */
export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="text-sm text-rose-400 w-full">
      <hr className="mb-4 border-rose-100"/>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link href="/about" className="hover:text-rose-600 transition-colors">
          {t('footer.about')}
        </Link>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header"
          className="hover:text-rose-600 transition-colors"
          target="_blank"
        >
          {t('footer.contact')}
        </a>
        <Link href="/terms" className="hover:text-rose-600 transition-colors">{t('footer.terms')}</Link>
        <Link href="/privacy" className="hover:text-rose-600 transition-colors">{t('footer.privacy')}</Link>
        <Link href="/license" className="hover:text-rose-600 transition-colors">{t('footer.license')}</Link>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        {t('footer.copyright')}
      </p>
    </footer>
  )
}