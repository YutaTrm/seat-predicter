'use client'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

/**
 * 汎用モーダルコンポーネント
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-rose-100 p-6 rounded max-w-lg w-full mx-4">
        {title && (
          <h3 className="text-lg font-bold text-rose-500 mb-4">{title}</h3>
        )}
        <div className="text-sm text-gray-600">
          {children}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-700"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}