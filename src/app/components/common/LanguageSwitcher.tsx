'use client'

import { useLanguage, locales, localeNames, type Locale } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale)
  }

  return (
    <div className="flex items-center gap-1">
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <select
        value={locale}
        onChange={handleLocaleChange}
        className="text-sm text-gray-700 px-2 rounded bg-white border cursor-pointer"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  )
}
