import { useEffect, RefObject } from 'react'
import { Ticket } from '@/types/ticket'
import { CELL_SIZE, BLOCK_SPACING_X, BLOCK_SPACING_Y, PADDING } from '@/constants/ticketGrid'
import {
  calculateFontSizes,
  drawHeader,
  drawStats,
  drawSocialInfo,
  drawBlock,
  drawLegend,
  createLotterySlotColorMap
} from '../utils/canvasDrawing'
import {
  groupTickets,
  getBlockLetters,
  getMaxBlockNumbers,
  getAllBlockKeys,
  calculateBlockNumberMaxWidths,
  calculateBlockMaxHeights,
  calculateBlockSizes
} from '../utils/blockCalculations'
import { ProcessedData } from '../types'

// 凡例の高さを計算する関数
const calculateLegendHeight = (
  ctx: CanvasRenderingContext2D,
  tickets: Ticket[],
  canvasWidth: number,
  normalFontSize: number
): number => {
  const colorMap = createLotterySlotColorMap(tickets)
  const legendSpacing = 10
  const legendHeight = normalFontSize * 1.5

  ctx.font = `${normalFontSize}px sans-serif`

  let currentX = PADDING
  let currentY = 0
  let maxRowHeight = 0

  colorMap.forEach((color, lotterySlotId) => {
    const lotterySlotName = tickets.find(t => t.lottery_slots_id === lotterySlotId)?.lottery_slots_name || `種別 ${lotterySlotId}`
    const textWidth = ctx.measureText(lotterySlotName).width

    currentX += textWidth + legendHeight + legendSpacing * 2

    // 次の行に移動する判定
    if (currentX > canvasWidth - PADDING) {
      currentX = PADDING
      currentY += legendHeight + legendSpacing
      maxRowHeight = Math.max(maxRowHeight, legendHeight)
    }
  })

  return currentY + legendHeight + legendSpacing
}

export const useCanvasDrawing = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  tickets: Ticket[],
  artistName: string,
  tourName: string,
  processedData: ProcessedData
) => {
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const filteredTickets = processedData.filteredTickets

    // チケットのグループ化と基本情報の計算
    const grouped = groupTickets(filteredTickets)
    const blockLetters = getBlockLetters(filteredTickets)
    const maxBlockNumbers = getMaxBlockNumbers(filteredTickets, blockLetters)
    const allBlockKeys = getAllBlockKeys(blockLetters, maxBlockNumbers)

    // ブロックサイズの計算
    const blockNumberMaxWidths = calculateBlockNumberMaxWidths(filteredTickets)
    const blockMaxHeights = calculateBlockMaxHeights(filteredTickets, blockLetters)
    const blockSizes = calculateBlockSizes(allBlockKeys, grouped, blockNumberMaxWidths, blockMaxHeights)

    // キャンバスサイズの計算
    let maxCanvasWidth = 0
    let totalCanvasHeight = PADDING * 2

    const rowHeights: Record<string, number> = {}
    const rowWidths: Record<string, number> = {}

    blockLetters.forEach(letter => {
      const blocks = allBlockKeys.filter(key => key.startsWith(letter))

      // 行の幅を計算（最後のブロックに余計なスペースが入らないように）
      const width = blocks.reduce((sum, key) => {
        return sum + blockSizes[key].width * CELL_SIZE + BLOCK_SPACING_X
      }, -BLOCK_SPACING_X)

      // 行の高さを計算（同じblockを持つブロック間で統一された高さを使用）
      const height = blockMaxHeights[letter] * CELL_SIZE + BLOCK_SPACING_Y

      rowWidths[letter] = width
      rowHeights[letter] = height

      maxCanvasWidth = Math.max(maxCanvasWidth, width)
      totalCanvasHeight += height
    })

    // フォントサイズの計算
    const tempCanvasWidth = maxCanvasWidth + PADDING * 2
    const tempCanvasHeight = totalCanvasHeight + PADDING * 2
    const fontSizes = calculateFontSizes(tempCanvasWidth, tempCanvasHeight)

    // 凡例の高さを計算
    const legendColorMap = createLotterySlotColorMap(tickets)
    const additionalLegendHeight = legendColorMap.size > 0
      ? calculateLegendHeight(ctx, tickets, canvas.width, fontSizes.normalFontSize)
      : 0

    canvas.width = maxCanvasWidth + PADDING * 2
    canvas.height = totalCanvasHeight + PADDING * 2 + fontSizes.titleFontSize * 2 + additionalLegendHeight

    // 背景を白で塗りつぶす
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // ヘッダー情報の描画
    drawHeader(ctx, artistName, tourName, fontSizes, canvas.width)

    // 統計情報の描画
    drawStats(ctx, tickets.length, fontSizes, fontSizes.titleFontSize)

    // 凡例を描画（統計情報の下）
    const drawnLegendHeight = drawLegend(
      ctx,
      tickets,
      canvas.width,
      PADDING + fontSizes.titleFontSize * 3.5 + fontSizes.normalFontSize,
      fontSizes.normalFontSize
    )

    // SNSとURL情報の描画
    drawSocialInfo(ctx, canvas.width, fontSizes)

    // ブロックの描画
    let yOffset = PADDING + fontSizes.titleFontSize * 4 + drawnLegendHeight

    for (const letter of blockLetters) {
      const blockKeys = allBlockKeys.filter(k => k.startsWith(letter))
      const rowHeight = rowHeights[letter]
      let xOffset = PADDING

      for (const blockKey of blockKeys) {
        const blockTickets = grouped[blockKey] || []
        const blockSize = blockSizes[blockKey]
        const ticketSet = new Set(blockTickets.map(t => `${t.column}-${t.number}`))

        drawBlock(ctx, blockKey, blockSize, ticketSet, xOffset, yOffset, tickets)
        xOffset += blockSize.width * CELL_SIZE + BLOCK_SPACING_X
      }

      yOffset += rowHeight
    }
  }, [canvasRef, tickets, artistName, tourName, processedData])
}