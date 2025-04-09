'use client'

import { useState } from 'react'

/**
 * アコーディオンUIコンポーネント
 * @param title - アコーディオンのタイトル
 * @param children - アコーディオンの中身となるコンポーネント
 */
interface AccordionProps {
  title: string
  children: React.ReactNode
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-md bg-white shadow-sm text-sm">
      <button
        className="w-full px-2 py-1 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-200 ease-in-out
          ${isOpen ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="p-4 border-t">
          {children}
        </div>
      </div>
    </div>
  )
}