import { CELL_SIZE, LABEL_HEIGHT, PADDING } from '@/constants/ticketGrid'
import { BlockSize } from '../types'
import { Ticket } from '@/types/ticket'

/**
 * 均等な色相分布の色を生成
 * @param totalColors 生成する色の総数
 * @returns 色の配列（HSL形式の文字列）
 */
export const generateUniqueColors = (totalColors: number): string[] => {
  const colors: string[] = []
  for (let i = 0; i < totalColors; i++) {
    const hue = (i * (360 / totalColors)) % 360
    colors.push(`hsl(${hue}, 80%, 70%)`)
  }
  return colors
}

/**
 * チケット種別ごとの色マッピングを生成
 * @param tickets チケットの配列
 * @returns 種別IDと色のマップ
 */
export const createLotterySlotColorMap = (tickets: Ticket[]): Map<number, string> => {
  const uniqueLotterySlotIds = Array.from(new Set(tickets.map(t => t.lottery_slots_id)))
  const colors = generateUniqueColors(uniqueLotterySlotIds.length)

  const colorMap = new Map<number, string>()
  uniqueLotterySlotIds.forEach((id, index) => {
    colorMap.set(id, colors[index])
  })

  return colorMap
}

/**
 * 凡例を描画
 * @param ctx キャンバスコンテキスト
 * @param tickets チケットの配列
 * @param canvasWidth キャンバスの幅
 * @param yOffset 描画開始のY座標
 * @param normalFontSize フォントサイズ
 * @returns 凡例の高さ
 */
export const drawLegend = (
  ctx: CanvasRenderingContext2D,
  tickets: Ticket[],
  canvasWidth: number,
  yOffset: number,
  normalFontSize: number,
  colorMap: Map<number, string>
): number => {
  const legendSpacing = normalFontSize * 0.5
  const legendHeight = normalFontSize * 1.2
  const sampleSize = normalFontSize

  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = `${normalFontSize}px sans-serif`
  ctx.fillStyle = '#6B7280'

  let currentX = PADDING
  let currentY = yOffset
  let maxRowHeight = 0

  // 「チケット種別」のラベルを描画
  ctx.fillText('チケット種別:', currentX, currentY)
  currentX += ctx.measureText('チケット種別:').width + legendSpacing * 2

  // lottery_slots_idの昇順でソート
  Array.from(colorMap.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([lotterySlotId, color]) => {
      const lotterySlotName = tickets.find(t => t.lottery_slots_id === lotterySlotId)?.lottery_slots_name || `種別 ${lotterySlotId}`
      const textWidth = ctx.measureText(lotterySlotName).width + sampleSize + legendSpacing * 3

      // 次の行に移動する判定
      if (currentX + textWidth > canvasWidth - PADDING) {
        currentX = PADDING
        currentY += legendHeight + legendSpacing
        maxRowHeight = Math.max(maxRowHeight, legendHeight)
      }

    // 色のサンプル
    ctx.fillStyle = color
    ctx.fillRect(currentX, currentY - sampleSize/2, sampleSize, sampleSize)

    // テキスト
    ctx.fillStyle = '#6B7280'
    ctx.fillText(lotterySlotName, currentX + sampleSize + legendSpacing, currentY)

    currentX += textWidth + legendSpacing
  })

  return (currentY - yOffset) + legendHeight + legendSpacing
}

type FontSizes = {
  titleFontSize: number
  subtitleFontSize: number
  normalFontSize: number
  lineHeight: number
}

/**
 * フォントサイズを計算
 */
export const calculateFontSizes = (canvasWidth: number, canvasHeight: number): FontSizes => {
  const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.025
  return {
    titleFontSize: Math.min(Math.max(baseFontSize * 1.5, 16), 32),
    subtitleFontSize: Math.min(Math.max(baseFontSize * 1.2, 14), 24),
    normalFontSize: Math.min(Math.max(baseFontSize, 12), 18),
    lineHeight: Math.min(Math.max(baseFontSize, 12), 18) * 1.5
  }
}

/**
 * ヘッダー情報を描画（アーティスト名、ツアー名、座席分布）
 */
export const drawHeader = (
  ctx: CanvasRenderingContext2D,
  artistName: string,
  tourName: string,
  fontSizes: FontSizes,
  canvasWidth: number
) => {
  const { titleFontSize, subtitleFontSize } = fontSizes

  ctx.textAlign = 'center'
  ctx.fillStyle = '#F43F5E'

  ctx.font = `${titleFontSize}px sans-serif`
  ctx.fillText(`${artistName}`, canvasWidth / 2, PADDING + titleFontSize)

  ctx.font = `${subtitleFontSize}px sans-serif`
  ctx.fillText(`${tourName}`, canvasWidth / 2, PADDING + titleFontSize * 2)

  ctx.fillStyle = '#6B7280'
  ctx.fillText(`座席分布`, canvasWidth / 2, PADDING + titleFontSize * 3)
}

/**
 * 統計情報を描画
 */
export const drawStats = (
  ctx: CanvasRenderingContext2D,
  totalTickets: number,
  fontSizes: FontSizes,
  titleFontSize: number
) => {
  const now = new Date()
  const dateString = `[${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}時点]`

  ctx.font = `${fontSizes.normalFontSize}px sans-serif`
  ctx.textAlign = 'left'
  ctx.fillStyle = '#6B7280'

  ctx.fillText(
    `全:${totalTickets}件 ${dateString}`,
    PADDING,
    PADDING + titleFontSize * 3.5
  )
}

/**
 * SNSとURL情報を描画
 */
export const drawSocialInfo = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  fontSizes: FontSizes
) => {
  const { normalFontSize, lineHeight } = fontSizes

  ctx.textAlign = 'right'
  ctx.fillStyle = '#6B7280'
  ctx.font = `${normalFontSize * 0.8}px sans-serif`
  ctx.fillText('X : @zasekiyosou_app', canvasWidth - PADDING, lineHeight)
  ctx.fillText('URL : zasekiyosou.com', canvasWidth - PADDING, lineHeight * 2)
}

/**
 * ブロックを描画
 */
export const drawBlock = (
  ctx: CanvasRenderingContext2D,
  blockKey: string,
  blockSize: BlockSize,
  ticketSet: Set<string>,
  xOffset: number,
  yOffset: number,
  tickets: Ticket[],
  colorMap: Map<number, string>
) => {
  const { width, height, count } = blockSize

  // ブロック全体を囲む枠線
  ctx.strokeStyle = '#9CA3AF'
  ctx.strokeRect(
    xOffset,
    yOffset + LABEL_HEIGHT,
    width * CELL_SIZE,
    height * CELL_SIZE
  )

  // テキスト描画の基本設定
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // ラベル
  ctx.fillStyle = '#F43F5E'
  ctx.fillText(blockKey, xOffset + (width * CELL_SIZE) / 2, yOffset + LABEL_HEIGHT / 2)

  // セル
  for (let row = 1; row <= height; row++) {
    for (let col = 1; col <= width; col++) {
      const x = xOffset + (col - 1) * CELL_SIZE
      const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE

      const cellKey = `${row}-${col}`
      const hasTicket = ticketSet.has(cellKey)

      // セルの背景色
      if (hasTicket) {
        // ブロックレターとナンバーを正しく分離
        const match = blockKey.match(/([A-Z]+)(\d+)/)
        if (!match) continue

        const [, blockLetter, blockNumberStr] = match
        const blockNumber = parseInt(blockNumberStr)

        const ticket = tickets.find(t =>
          t.block === blockLetter &&
          t.block_number === blockNumber &&
          t.column === row &&
          t.number === col
        )

        ctx.fillStyle = ticket ?
          colorMap.get(ticket.lottery_slots_id) || '#F43F5E' :
          '#F43F5E'
      } else {
        ctx.fillStyle = '#F3F4F6'
      }

      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)

      // セルの枠線
      ctx.strokeStyle = '#D1D5DB'
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
    }
  }

  // 行番号（右端）
  ctx.fillStyle = '#6B7280'
  ctx.textAlign = 'left'
  for (let row = 1; row <= height; row++) {
    const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE + CELL_SIZE / 2
    ctx.fillText(`${row}`, xOffset + width * CELL_SIZE + 4, y)
  }

  // 列番号（下端）
  ctx.textAlign = 'center'
  for (let col = 1; col <= width; col++) {
    const x = xOffset + (col - 1) * CELL_SIZE + CELL_SIZE / 2
    ctx.fillText(`${col}`, x, yOffset + LABEL_HEIGHT + height * CELL_SIZE + 12)
  }

  // チケット数
  ctx.fillText(
    `[${count}枚]`,
    xOffset + (width * CELL_SIZE) / 2,
    yOffset + LABEL_HEIGHT + height * CELL_SIZE + 32
  )
}