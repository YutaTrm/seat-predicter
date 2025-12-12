'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { TicketGridCanvasProps } from './TicketGrid/types'
import { useOutlierDetection } from './TicketGrid/hooks/useOutlierDetection'
import { useCanvasDrawing } from './TicketGrid/hooks/useCanvasDrawing'

/**
 * ブロックの配置とサイズの決定ルール
 *
 * 1. 異常値の除外と表示
 *    - サンプル数が10件未満の場合は基本的なバリデーションのみ
 *    - 10件以上の場合：
 *      a. 出現回数が1回のみの値を対象
 *      b. 上位25%の値の1.5倍を超える値を異常値として除外
 *      例：列番[3,1,1,5,5,5,15,4,11,14,14,25,12]の場合
 *          - 上位25%の値は14
 *          - 14×1.5=21を超える値（25）を異常値として除外
 *    - 除外された値は赤色で表示
 *
 * 2. ブロック数の決定
 *    - ブロックレター（A, B, C...）ごとに、最大のブロック番号までブロックを生成
 *    - 例：Aブロックで最大が3番なら、A1, A2, A3を生成
 *
 * 3. ブロックの幅の決定（異常値を除外後のデータから計算）
 *    - 同じブロック番号（例：A1, B1, C1）を持つブロック間で統一
 *    - そのブロック番号を持つチケットの中で最大の席番を使用
 *    - チケットがない場合は12を使用
 *
 * 4. ブロックの高さの決定（異常値を除外後のデータから計算）
 *    - 同じブロックレター（例：A1, A2, A3）を持つブロック間で統一
 *    - そのブロックレターを持つチケットの中で最大の列番を使用
 *    - チケットがない場合は12を使用
 *
 * 5. レイアウト
 *    - 統計情報は大きめのフォントで表示
 *    - 要素間の余白を適切に確保し、重なりを防止
 */
const TicketGridCanvas = ({ tickets, artistName, tourName }: TicketGridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()
  const [showEmptyBlocks, setShowEmptyBlocks] = useState(false)
  const {
    enableOutlierDetection,
    setEnableOutlierDetection,
    outlierStats,
    processedData
  } = useOutlierDetection(tickets)

  const renderKey = useCanvasDrawing(canvasRef, tickets, artistName, tourName, processedData, showEmptyBlocks)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border p-2 bg-white">
        <canvas ref={canvasRef} className="hidden" />
        {canvasRef.current && (
          <Image
            key={renderKey}
            src={canvasRef.current.toDataURL('image/png')}
            alt={artistName + " " + tourName + " の座席分布"}
            width={canvasRef.current.width}
            height={canvasRef.current.height}
            className="max-w-full"
            unoptimized // Data URLを使用するため最適化をスキップ
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <h3 className='text-sm'>{t('home.ticketGrid.outlierDetection')} :</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="outlier-detection"
            checked={!enableOutlierDetection}
            onChange={() => setEnableOutlierDetection(false)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={!enableOutlierDetection ? 'text-rose-500' : 'text-gray-600'}>{t('home.ticketGrid.off')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="outlier-detection"
            checked={enableOutlierDetection}
            onChange={() => setEnableOutlierDetection(true)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={enableOutlierDetection ? 'text-rose-500' : 'text-gray-600'}>{t('home.ticketGrid.on')}</span>
        </label>
      </div>

      <div className="flex items-center gap-4">
        <h3 className='text-sm'>{t('home.ticketGrid.emptyBlocks')} :</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="show-empty-blocks"
            checked={showEmptyBlocks}
            onChange={() => setShowEmptyBlocks(true)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={showEmptyBlocks ? 'text-rose-500' : 'text-gray-600'}>{t('home.ticketGrid.show')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="show-empty-blocks"
            checked={!showEmptyBlocks}
            onChange={() => setShowEmptyBlocks(false)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={!showEmptyBlocks ? 'text-rose-500' : 'text-gray-600'}>{t('home.ticketGrid.hide')}</span>
        </label>
      </div>

      {enableOutlierDetection && outlierStats.outlierTickets.length > 0 && (
        // トゲがあるから非表示にしとく
        <div className="px-2 space-y-2 hidden">
          <span className="text-sm text-gray-600">
            {t('home.ticketGrid.excludedTickets')}: {outlierStats.outliers}{t('home.ticketGrid.ticketsCount')}
          </span>
          <span className="text-sm text-gray-600 break-all">
            {outlierStats.outlierTickets.map((ticket, i) => (
              <span key={i}>
                {ticket}
                {i < outlierStats.outlierTickets.length - 1 && ', '}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  )
}

export default TicketGridCanvas