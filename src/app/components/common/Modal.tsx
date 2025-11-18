'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  actions?: React.ReactNode
}

/**
 * 汎用モーダルコンポーネント
 */
export default function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-rose-50 p-6 rounded max-w-lg w-full mx-4">
        {title && (
          <h3 className="text-lg font-bold text-rose-500 mb-4">{title}</h3>
        )}
        <div className="text-sm text-gray-600">
          {children}
        </div>
        <div className="mt-6 flex gap-2">
          {actions ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              {actions}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-700"
            >
              {t('common.close')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}