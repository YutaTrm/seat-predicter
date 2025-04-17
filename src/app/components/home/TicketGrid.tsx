'use client'

import { useEffect, useRef, useState } from 'react'
import { Ticket } from '@/types/ticket'

type TicketGridCanvasProps = {
  tickets: Ticket[]
}

const CELL_SIZE = 20
const BLOCK_SPACING_X = 40
const BLOCK_SPACING_Y = 90
const LABEL_HEIGHT = 24
const PADDING = 20
const FONT_SIZE = 14

const TicketGridCanvas = ({ tickets }: TicketGridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const validTickets = tickets.filter(t => /^[A-Z]$/.test(t.block))

    const grouped = validTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
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

    // block_number別の最大幅を計算
    const blockNumberMaxWidths: Record<string, number> = {}
    const uniqueBlockNumbers = Array.from(new Set(validTickets.map(t => t.block_number)))

    uniqueBlockNumbers.forEach(blockNumber => {
      const sameNumberTickets = validTickets.filter(t => t.block_number === blockNumber)
      blockNumberMaxWidths[blockNumber] = Math.max(...sameNumberTickets.map(t => t.number)) || 5
    })

    // block別の最大高さを計算
    const blockMaxHeights: Record<string, number> = {}

    blockLetters.forEach(letter => {
      const letterTickets = validTickets.filter(t => t.block === letter)
      blockMaxHeights[letter] = Math.max(...letterTickets.map(t => t.column)) || 5
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
      const rowWidth = blocks.reduce((sum, key) => {
        return sum + blockSizes[key].width * CELL_SIZE + BLOCK_SPACING_X
      }, -BLOCK_SPACING_X)

      // 行の高さを計算（同じblockを持つブロック間で統一された高さを使用）
      const rowHeight = blockMaxHeights[letter] * CELL_SIZE + BLOCK_SPACING_Y

      rowWidths[letter] = rowWidth
      rowHeights[letter] = rowHeight

      maxCanvasWidth = Math.max(maxCanvasWidth, rowWidth)
      totalCanvasHeight += rowHeight
    })

    const canvasWidth = maxCanvasWidth + PADDING * 2
    const canvasHeight = totalCanvasHeight

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // 背景を白で塗りつぶす
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${FONT_SIZE}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    let yOffset = PADDING

    for (const letter of blockLetters) {
      const blockKeys = allBlockKeys.filter(k => k.startsWith(letter))
      const rowHeight = rowHeights[letter]
      const rowWidth = rowWidths[letter]

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
          yOffset + LABEL_HEIGHT + height * CELL_SIZE + 32
        )

        xOffset += width * CELL_SIZE + BLOCK_SPACING_X
      }

      yOffset += rowHeight
    }
  }, [tickets])

  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      setImageUrl(dataUrl)
    }
  }, [tickets])

  return (
    <>
      <div className="overflow-x-auto border p-2 bg-white">
        <canvas ref={canvasRef} className="hidden" />
        <img
          src={imageUrl}
          alt="座席分布"
          className="max-w-full cursor-pointer hover:opacity-80"
        />
      </div>
    </>
  )
}

export default TicketGridCanvas
