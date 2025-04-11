'use client'

import Link from "next/link"

/**
 * フッターコンポーネント
 */
export default function Footer() {
  return (
    <footer className="text-sm text-gray-700 w-full mt-8">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center space-x-6">
        <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
          アプリについて
        </Link>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdhaKuEJxG7hJBMRp1O5g2I4tzngi9gN2LqQfMEDjBUDaelIg/viewform?usp=header"
          className="text-gray-700 hover:text-gray-900 transition-colors"
          target="_blank"
        >
          問い合わせ
        </a>
      </div>
      <p className="text-xs text-gray-500 text-center mt-1">
        ©2025 座席予想掲示板 · <a href="/license" className="underline">License</a>
      </p>
    </footer>
  )
}