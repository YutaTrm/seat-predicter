'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Ticket } from '@/types/ticket'

type TicketGridCanvasProps = {
  tickets: Ticket[]
  artistName: string
  tourName: string
}

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

// 描画関連の定数
const CELL_SIZE = 20
const BLOCK_SPACING_X = 40
const BLOCK_SPACING_Y = 90
const LABEL_HEIGHT = 24
const PADDING = 20
const FONT_SIZE = 14
const OFFSET_Y_SIZE = 40
const STATS_FONT_SIZE = 28 // 統計情報の文字サイズを大きく
const DEFAULT_SIZE = 12 // チケットがない場合のデフォルトサイズ
const STATS_LINE_HEIGHT = STATS_FONT_SIZE + 8 // 統計情報の行間
const EXCLUDED_VALUE_COLOR = '#F43F5E' // 除外された値の色

// チケットの制約値
const MAX_BLOCK_NUMBER = 20
const MAX_COLUMN = 30
const MAX_NUMBER = 20
const MIN_SAMPLES = 10 // 異常値判定を開始するための最小サンプル数

/**
 * 改良版の異常値検出
 * @param values 検証する値の配列
 * @param maxValue 許容される最大値
 * @returns 異常でない値の配列
 */
const filterOutliers = (values: number[], maxValue: number): number[] => {
  if (values.length === 0) return []

  // 基本的なバリデーション（1以上maxValue以下）
  const validValues = values.filter(v => v >= 1 && v <= maxValue)
  if (validValues.length === 0) return []

  // サンプル数が少ない場合は基本的なバリデーションのみ
  if (validValues.length < MIN_SAMPLES) {
    return validValues
  }

  // 値の出現回数をカウント
  const frequency: Record<number, number> = {}
  validValues.forEach(v => {
    frequency[v] = (frequency[v] || 0) + 1
  })

  // 値の統計情報を計算
  const sortedValues = [...validValues].sort((a, b) => a - b)
  const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)]

  // 異常値の判定
  // 1. 出現回数が1回
  // 2. 中央値からの距離が大きい（Q3よりも大きい）
  return validValues.filter(v => {
    const freq = frequency[v]
    if (freq > 1) return true // 複数回出現する値は正常とみなす
    return v <= q3 * 1.5 // 1回しか出現しない値は、Q3の1.5倍までを許容
  })
}

const TicketGridCanvas = ({ tickets, artistName, tourName }: TicketGridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enableOutlierDetection, setEnableOutlierDetection] = useState(false)
  const [outlierStats, setOutlierStats] = useState<{
    outliers: number
    outlierTickets: string[]
  }>({ outliers: 0, outlierTickets: [] })

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 統計情報の初期化
    const stats = {
      totalTickets: tickets.length,
      validTickets: 0,
      outliers: 0,
      outlierTickets: [] as string[], // 除外されたチケットのリスト
      validRanges: {} as Record<string, { columns: Set<number>, numbers: Set<number> }>
    }

    // 基本的なバリデーション（ブロック名が大文字アルファベット1文字）
    const validTickets = tickets.filter(t => /^[A-Z]$/.test(t.block))
    stats.validTickets = validTickets.length

    // ブロックごとの列番と席番の異常値を検出
    const blockGroups = validTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
      const key = t.block
      acc[key] = acc[key] || []
      acc[key].push(t)
      return acc
    }, {})

    // 各ブロックで異常値を検出と除外
    const processedData = Object.entries(blockGroups).reduce((acc, [block, blockTickets]) => {
      // 列番と席番の配列を取得
      const columns = blockTickets.map(t => t.column)
      const numbers = blockTickets.map(t => t.number)

      // 異常値を除外した有効な値の範囲を取得
      const validColumns = new Set(filterOutliers(columns, MAX_COLUMN))
      const validNumbers = new Set(filterOutliers(numbers, MAX_NUMBER))

      // 有効な値の範囲を保存
      acc.validRanges[block] = {
        columns: validColumns,
        numbers: validNumbers
      }

      // 異常値判定が有効な場合のみ除外処理を行う
      if (enableOutlierDetection) {
        // 除外されたチケットを記録
        const excluded = blockTickets.filter(t => {
          const isValid = t.block_number <= MAX_BLOCK_NUMBER &&
            validColumns.has(t.column) &&
            validNumbers.has(t.number)

          if (!isValid) {
            acc.outlierTickets.push(`${t.block}${t.block_number}-${t.column}-${t.number}`)
          }
          return !isValid
        })

        // 除外されたチケット数を記録
        acc.outliers += excluded.length

        // 有効なチケットのみを追加
        acc.filteredTickets.push(...blockTickets.filter(t => !excluded.includes(t)))
      } else {
        // 異常値判定が無効の場合は全てのチケットを使用
        acc.filteredTickets.push(...blockTickets)
      }

      return acc
    }, {
      filteredTickets: [] as Ticket[],
      outliers: 0,
      outlierTickets: [] as string[],
      validRanges: {} as Record<string, { columns: Set<number>, numbers: Set<number> }>
    })

    // 除外チケット情報を保存
    setOutlierStats({
      outliers: processedData.outliers,
      outlierTickets: processedData.outlierTickets
    })

    const filteredTickets = processedData.filteredTickets
    stats.validRanges = processedData.validRanges

    // グループ化（ブロック+ブロック番号でグループ化）
    const grouped = filteredTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
      const key = `${t.block}${t.block_number}`
      acc[key] = acc[key] || []
      acc[key].push(t)
      return acc
    }, {})

    const blockLetters = Array.from(new Set(validTickets.map(t => t.block))).sort()

    const maxBlockNumbers = blockLetters.reduce<Record<string, number>>((acc, letter) => {
      acc[letter] = Math.max(...validTickets.filter(t => t.block === letter).map(t => t.block_number))
      return acc
    }, {})

    const allBlockKeys = blockLetters.flatMap(letter => {
      return Array.from({ length: maxBlockNumbers[letter] }, (_, i) => `${letter}${i + 1}`)
    })

    // block_number別の最大幅を計算（異常値を除外したデータから）
    const blockNumberMaxWidths: Record<string, number> = {}
    const uniqueBlockNumbers = Array.from(new Set(filteredTickets.map(t => t.block_number)))

    uniqueBlockNumbers.forEach(blockNumber => {
      const sameNumberTickets = filteredTickets.filter(t => t.block_number === blockNumber)
      blockNumberMaxWidths[blockNumber] = Math.max(...sameNumberTickets.map(t => t.number)) || DEFAULT_SIZE
    })

    // block別の最大高さを計算（異常値を除外したデータから）
    const blockMaxHeights: Record<string, number> = {}

    blockLetters.forEach(letter => {
      const letterTickets = filteredTickets.filter(t => t.block === letter)
      blockMaxHeights[letter] = Math.max(...letterTickets.map(t => t.column)) || DEFAULT_SIZE
    })

    // 各ブロックのサイズを設定
    const blockSizes: Record<string, { width: number, height: number, count: number }> = {}

    allBlockKeys.forEach(blockKey => {
      const blockTickets = grouped[blockKey] || []
      const letter = blockKey[0]
      const blockNumber = parseInt(blockKey.slice(1))

      blockSizes[blockKey] = {
        // 同じblock_numberを持つブロック間で幅を統一
        width: blockNumberMaxWidths[blockNumber],
        // 同じblockを持つブロック間で高さを統一
        height: blockMaxHeights[letter],
        count: blockTickets.length
      }
    })

    const rowHeights: Record<string, number> = {}
    const rowWidths: Record<string, number> = {}

    // キャンバスのサイズを計算
    let maxCanvasWidth = 0
    let totalCanvasHeight = PADDING * 2

    blockLetters.forEach(letter => {
      const blocks = allBlockKeys.filter(key => key.startsWith(letter))

      // 行の幅を計算（最後のブロックに余計なスペースが入らないように）
      const width = blocks.reduce((sum, key) => {
        return sum + blockSizes[key].width * CELL_SIZE + BLOCK_SPACING_X
      }, -BLOCK_SPACING_X)

      // 行の高さを計算（同じblockを持つブロック間で統一された高さを使用）
      const height = blockMaxHeights[letter] * CELL_SIZE + BLOCK_SPACING_Y

      // 各行のサイズを保存
      rowWidths[letter] = width
      rowHeights[letter] = height

      // キャンバス全体のサイズを更新
      maxCanvasWidth = Math.max(maxCanvasWidth, width)
      totalCanvasHeight += height
    })

    const canvasWidth = maxCanvasWidth + PADDING * 2
    // SNSとURL情報のための余白を追加
    const canvasHeight = totalCanvasHeight + PADDING * 2 + STATS_LINE_HEIGHT * 6

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // 背景を白で塗りつぶす
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // アーティスト名とツアー名を表示
    ctx.font = `${STATS_FONT_SIZE + 20}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = '#F43F5E'
    ctx.fillText(`${artistName}`, canvas.width / 2, PADDING + STATS_LINE_HEIGHT * 2)
    ctx.fillText(`${tourName}`, canvas.width / 2, PADDING + STATS_LINE_HEIGHT * 4)
    ctx.fillStyle = '#6B7280'
    ctx.fillText(`座席分布`, canvas.width / 2, PADDING + STATS_LINE_HEIGHT * 6)

    // 統計情報の表示
    ctx.font = `${STATS_FONT_SIZE}px sans-serif`
    ctx.textAlign = 'left'
    ctx.fillStyle = '#6B7280'

    // 総チケット数と異常値の件数を表示
    const now = new Date();
    const dateSting = `[${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}時点]`
    const outlierPercentage = ((stats.outliers / stats.totalTickets) * 100).toFixed(1)
    ctx.fillText(`総チケット数: ${stats.totalTickets}件 ${dateSting}`, PADDING, PADDING + STATS_LINE_HEIGHT * 6 + OFFSET_Y_SIZE)

    // 描画開始位置の初期化
    let yOffset = PADDING + STATS_LINE_HEIGHT * 8

    // 本番では描画しない 除外情報
    if (process.env.NODE_ENV !== 'production') {
      ctx.fillText(
        `異常値として除外: ${processedData.outliers}件 (${outlierPercentage}%)`,
        PADDING,
        PADDING + STATS_LINE_HEIGHT
      )// 左上に配置

      // 除外されたチケットのリストを表示（1行あたり5件まで）
      if (processedData.outlierTickets.length > 0 && processedData.validRanges) {
        const ticketsPerLine = 5
        for (let i = 0; i < processedData.outlierTickets.length; i += ticketsPerLine) {
          const parts = processedData.outlierTickets.slice(i, i + ticketsPerLine).map(ticket => {
            const [blockInfo, column, number] = ticket.split('-')
            const [block, blockNum] = [blockInfo.slice(0, 1), parseInt(blockInfo.slice(1))]
            const columnNum = parseInt(column)
            const numberNum = parseInt(number)

            // block_numberが制限を超えている場合は全体を赤く
            if (blockNum > MAX_BLOCK_NUMBER) {
              return `<red>${blockInfo}-${column}-${number}</red>`
            }

            return `${blockInfo}-${
              !processedData.validRanges[block]?.columns.has(columnNum) ? `<red>${column}</red>` : column
            }-${
              !processedData.validRanges[block]?.numbers.has(numberNum) ? `<red>${number}</red>` : number
            }`
          })

          // 赤色のテキストを処理
          let xPos = PADDING
          const yPos = PADDING + STATS_LINE_HEIGHT * (2 + Math.floor(i / ticketsPerLine))

          for (let j = 0; j < parts.length; j++) {
            const segments = parts[j].split(/(<red>.*?<\/red>)/)
            for (const segment of segments) {
              if (segment.startsWith('<red>')) {
                ctx.fillStyle = EXCLUDED_VALUE_COLOR
                const text = segment.replace(/<\/?red>/g, '')
                ctx.fillText(text, xPos, yPos)
                xPos += ctx.measureText(text).width
              } else {
                ctx.fillStyle = '#6B7280'
                ctx.fillText(segment, xPos, yPos)
                xPos += ctx.measureText(segment).width
              }
            }

            // カンマと空白を追加（最後の要素以外）
            if (j < parts.length - 1) {
              ctx.fillStyle = '#6B7280'
              ctx.fillText(', ', xPos, yPos)
              xPos += ctx.measureText(', ').width
            }
          }
        }

        // 統計情報の後に余白を追加
        yOffset = Math.max(
          yOffset,
          PADDING + STATS_LINE_HEIGHT * (5 + Math.floor((stats.outlierTickets.length - 1) / ticketsPerLine))
        )
      }
    }

    // SNSとURLを右下に表示
    ctx.textAlign = 'right'
    ctx.fillStyle = '#6B7280'
    ctx.fillText('X : @zasekiyosou_app', canvas.width - PADDING, STATS_LINE_HEIGHT)// 右上に配置
    ctx.fillText('URL : zasekiyosou.com', canvas.width - PADDING, STATS_LINE_HEIGHT * 2)

    // 描画設定を元に戻す
    ctx.font = `${FONT_SIZE}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // ブロックを生成
    for (const letter of blockLetters) {
      const blockKeys = allBlockKeys.filter(k => k.startsWith(letter))
      const rowHeight = rowHeights[letter]

      // 左寄せ：PADDINGからスタート
      let xOffset = PADDING

      for (const blockKey of blockKeys) {
        const blockTickets = grouped[blockKey] || []
        const { width, height, count } = blockSizes[blockKey]
        const ticketSet = new Set(blockTickets.map(t => `${t.column}-${t.number}`))

        // ブロック全体を囲む枠線
        ctx.strokeStyle = '#9CA3AF'
        ctx.strokeRect(
          xOffset,
          yOffset + LABEL_HEIGHT,
          width * CELL_SIZE,
          height * CELL_SIZE
        )

        // ラベル
        ctx.fillStyle = '#F43F5E'
        ctx.fillText(blockKey, xOffset + (width * CELL_SIZE) / 2, yOffset)

        // セル
        for (let row = 1; row <= height; row++) {
          for (let col = 1; col <= width; col++) {
            const x = xOffset + (col - 1) * CELL_SIZE
            const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE

            const has = ticketSet.has(`${row}-${col}`)

            // セルの背景色
            ctx.fillStyle = has ? '#F43F5E' : '#F3F4F6'
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)

            // セルの枠線
            ctx.strokeStyle = '#D1D5DB'
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
          }
        }

        // 行番号（右端）
        ctx.fillStyle = '#6B7280'
        for (let row = 1; row <= height; row++) {
          const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE + CELL_SIZE / 2
          ctx.fillText(`${row}`, xOffset + width * CELL_SIZE + 8, y)
        }

        // 列番号（下端）
        for (let col = 1; col <= width; col++) {
          const x = xOffset + (col - 1) * CELL_SIZE + CELL_SIZE / 2
          ctx.fillText(`${col}`, x, yOffset + LABEL_HEIGHT + height * CELL_SIZE + 16)
        }

        // チケット数
        ctx.fillText(
          `[${count}枚]`,
          xOffset + (width * CELL_SIZE) / 2,
          yOffset + LABEL_HEIGHT + height * CELL_SIZE + 36
        )

        xOffset += width * CELL_SIZE + BLOCK_SPACING_X
      }

      yOffset += rowHeight
    }
  }, [tickets, artistName, tourName, enableOutlierDetection])

  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      setImageUrl(dataUrl)
    }
  }, [tickets, artistName, tourName, enableOutlierDetection])

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border p-2 bg-white">
        <canvas ref={canvasRef} className="hidden" />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="座席分布"
            width={canvasRef.current?.width || 800}
            height={canvasRef.current?.height || 600}
            className="max-w-full"
            unoptimized // Data URLを使用するため最適化をスキップ
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <h3 className='text-sm'>AIによる外れ値補正 :</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="outlier-detection"
            checked={!enableOutlierDetection}
            onChange={() => setEnableOutlierDetection(false)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={!enableOutlierDetection ? 'text-rose-500' : 'text-gray-600'}>OFF</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="outlier-detection"
            checked={enableOutlierDetection}
            onChange={() => setEnableOutlierDetection(true)}
            className="text-rose-500 focus:ring-rose-500 hidden"
          />
          <span className={enableOutlierDetection ? 'text-rose-500' : 'text-gray-600'}>ON</span>
        </label>
      </div>

      {enableOutlierDetection && outlierStats.outlierTickets.length > 0 && (
        // トゲがあるから非表示にしとく
        <div className="px-2 space-y-2 hidden">
          <span className="text-sm text-gray-600">
            除外されたチケット: {outlierStats.outliers}件　
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
