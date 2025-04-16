'use client'

import { useEffect, useRef, useState } from 'react'
import { Ticket } from '@/types/ticket'

type TicketGridCanvasProps = {
  tickets: Ticket[]
}

// ==== パラメータ（調整しやすいようにまとめる） ====
const CELL_SIZE = 20
const BLOCK_SPACING_X = 40
const BLOCK_SPACING_Y = 60
const LABEL_HEIGHT = 24
const PADDING = 20
const FONT_SIZE = 14

const TicketGridCanvas = ({ tickets }: TicketGridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isCentered, setIsCentered] = useState<boolean>(true)

  // ==== Canvasを描画する処理 ====
  const drawCanvas = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const validTickets = tickets.filter(t => /^[A-Z]$/.test(t.block))

    // ブロックごとにチケットをまとめる
    const grouped = validTickets.reduce<Record<string, Ticket[]>>((acc, t) => {
      const key = `${t.block}${t.block_number}`
      acc[key] = acc[key] || []
      acc[key].push(t)
      return acc
    }, {})

    const blockLetters = Array.from(new Set(validTickets.map(t => t.block))).sort()

    // 各ブロック文字ごとの最大番号を取得
    const maxBlockNumbers = blockLetters.reduce<Record<string, number>>((acc, letter) => {
      acc[letter] = Math.max(...validTickets.filter(t => t.block === letter).map(t => t.block_number))
      return acc
    }, {})

    // 全てのブロックキーを生成（例：A1, A2, B1...）
    const allBlockKeys = blockLetters.flatMap(letter => {
      return Array.from({ length: maxBlockNumbers[letter] }, (_, i) => `${letter}${i + 1}`)
    })

    // === ブロックサイズを計算（最大列数＆行数に揃える） ===
    const maxColsPerNumber: Record<number, number> = {}
    const maxRowsPerLetter: Record<string, number> = {}

    allBlockKeys.forEach(blockKey => {
      const [letter, numberStr] = blockKey.match(/^([A-Z])(\d+)$/)!.slice(1)
      const number = Number(numberStr)
      const blockTickets = grouped[blockKey] || []
      const cols = blockTickets.length > 0 ? Math.max(...blockTickets.map(t => t.number)) : 5
      const rows = blockTickets.length > 0 ? Math.max(...blockTickets.map(t => t.column)) : 5

      maxColsPerNumber[number] = Math.max(maxColsPerNumber[number] || 0, cols)
      maxRowsPerLetter[letter] = Math.max(maxRowsPerLetter[letter] || 0, rows)
    })

    // ブロックごとのサイズを記録
    const blockSizes: Record<string, { width: number; height: number; count: number }> = {}
    allBlockKeys.forEach(blockKey => {
      const [letter, numberStr] = blockKey.match(/^([A-Z])(\d+)$/)!.slice(1)
      const number = Number(numberStr)
      const blockTickets = grouped[blockKey] || []
      blockSizes[blockKey] = {
        width: maxColsPerNumber[number],
        height: maxRowsPerLetter[letter],
        count: blockTickets.length
      }
    })

    // ==== キャンバスサイズを計算 ====
    const rowHeights: Record<string, number> = {}
    const rowWidths: Record<string, number> = {}

    const canvasWidth = blockLetters.reduce((maxWidth, letter) => {
      const blocks = allBlockKeys.filter(k => k.startsWith(letter))
      const rowWidth = blocks.reduce((sum, key) => {
        return sum + blockSizes[key].width * CELL_SIZE + BLOCK_SPACING_X
      }, -BLOCK_SPACING_X)
      rowWidths[letter] = rowWidth
      rowHeights[letter] = Math.max(...blocks.map(k => blockSizes[k].height)) * CELL_SIZE + BLOCK_SPACING_Y
      return Math.max(maxWidth, rowWidth)
    }, 0) + PADDING * 2

    const canvasHeight = blockLetters.reduce((sum, letter) => sum + rowHeights[letter], 0) + PADDING * 2

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // ==== 背景を白く塗る ====
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `${FONT_SIZE}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // ==== ブロックを描画 ====
    let yOffset = PADDING
    for (const letter of blockLetters) {
      const blockKeys = allBlockKeys.filter(k => k.startsWith(letter))
      const rowWidth = rowWidths[letter]
      const rowHeight = rowHeights[letter]
      let xOffset = isCentered ? (canvas.width - rowWidth) / 2 : PADDING

      for (const blockKey of blockKeys) {
        const blockTickets = grouped[blockKey] || []
        const { width, height, count } = blockSizes[blockKey]
        const ticketSet = new Set(blockTickets.map(t => `${t.column}-${t.number}`))

        // ラベル
        ctx.fillStyle = '#F43F5E'
        ctx.fillText(blockKey, xOffset + (width * CELL_SIZE) / 2, yOffset)

        // セルを描画
        for (let row = 1; row <= height; row++) {
          for (let col = 1; col <= width; col++) {
            const x = xOffset + (col - 1) * CELL_SIZE
            const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE
            const has = ticketSet.has(`${row}-${col}`)
            ctx.fillStyle = has ? '#F43F5E' : '#F3F4F6'
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
            ctx.strokeStyle = '#D1D5DB'
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
          }
        }

        // 行番号（右端）
        for (let row = 1; row <= height; row++) {
          const y = yOffset + LABEL_HEIGHT + (row - 1) * CELL_SIZE
          ctx.fillStyle = '#6B7280'
          ctx.fillText(`${row}`, xOffset + width * CELL_SIZE + 8, y + 1)
        }

        // 列番号（下端）
        for (let col = 1; col <= width; col++) {
          const x = xOffset + (col - 1) * CELL_SIZE
          ctx.fillStyle = '#6B7280'
          ctx.fillText(`${col}`, x + CELL_SIZE / 2, yOffset + LABEL_HEIGHT + height * CELL_SIZE + 2)
        }

        // チケット数
        ctx.fillStyle = '#6B7280'
        ctx.fillText(`[${count}枚]`, xOffset + (width * CELL_SIZE) / 2, yOffset + LABEL_HEIGHT + height * CELL_SIZE + 16)

        xOffset += width * CELL_SIZE + BLOCK_SPACING_X
      }

      yOffset += rowHeight
    }

    // ==== imageUrlを更新 ====
    const dataUrl = canvas.toDataURL('image/png')
    setImageUrl(dataUrl)
  }

  // 初回とチケット・中央寄せの切り替え時に再描画
  useEffect(() => {
    drawCanvas()
  }, [tickets, isCentered])

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
      <div className="text-center mt-2 flex justify-center gap-4">
        ブロックの配置：
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="alignment"
            checked={isCentered}
            onChange={() => setIsCentered(true)}
            className="form-radio h-4 w-4 text-rose-500"
          />
          <span className="ml-2 text-sm">中央寄せ</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="alignment"
            checked={!isCentered}
            onChange={() => setIsCentered(false)}
            className="form-radio h-4 w-4 text-rose-500"
          />
          <span className="ml-2 text-sm">左寄せ</span>
        </label>
      </div>
    </>
  )
}

export default TicketGridCanvas
