import { CELL_SIZE, LABEL_HEIGHT, PADDING } from '@/constants/ticketGrid'
import { BlockSize } from '../types'

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
  yOffset: number
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

  // ラベル
  ctx.fillStyle = '#F43F5E'
  ctx.fillText(blockKey, xOffset + (width * CELL_SIZE) / 2 + 12, yOffset + 12)

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
    xOffset + (width * CELL_SIZE) / 2 + 18,
    yOffset + LABEL_HEIGHT + height * CELL_SIZE + 36
  )
}