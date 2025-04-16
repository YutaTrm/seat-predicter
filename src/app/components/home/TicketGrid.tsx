'use client'

import { useEffect, useRef, useState } from 'react'
import { Ticket } from '@/types/ticket'

type TicketGridCanvasProps = {
  tickets: Ticket[]
}

const CELL_SIZE = 20
const BLOCK_SPACING_X = 40
const BLOCK_SPACING_Y = 60
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

    const blockSizes: Record<string, { width: number, height: number, count: number }> = {}

    allBlockKeys.forEach(blockKey => {
      const blockTickets = grouped[blockKey] || []
      const width = blockTickets.length > 0 ? Math.max(...blockTickets.map(t => t.number)) : 5
      const height = blockTickets.length > 0 ? Math.max(...blockTickets.map(t => t.column)) : 5
      blockSizes[blockKey] = {
        width,
        height,
        count: blockTickets.length
      }
    })

    const rowHeights: Record<string, number> = {}
    const rowWidths: Record<string, number> = {}

    const canvasWidth = blockLetters.reduce((maxWidth, letter) => {
      const blocks = allBlockKeys.filter(key => key.startsWith(letter))
      const rowWidth = blocks.reduce((sum, key) => {
        return sum + blockSizes[key].width * CELL_SIZE + BLOCK_SPACING_X
      }, -BLOCK_SPACING_X) // 最後のブロックに余計なスペースが入らないように
      rowWidths[letter] = rowWidth
      rowHeights[letter] = Math.max(...blocks.map(key => blockSizes[key].height)) * CELL_SIZE + BLOCK_SPACING_Y
      return Math.max(maxWidth, rowWidth)
    }, 0) + PADDING * 2

    const canvasHeight = blockLetters.reduce((sum, letter) => sum + rowHeights[letter], 0) + PADDING * 2

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

      // 🎯 中央寄せ：xOffsetのスタート位置をcanvas中央から逆算
      let xOffset = (canvas.width - rowWidth) / 2

      for (const blockKey of blockKeys) {
        const blockTickets = grouped[blockKey] || []
        const { width, height, count } = blockSizes[blockKey]
        const ticketSet = new Set(blockTickets.map(t => `${t.column}-${t.number}`))

        // ラベル
        ctx.fillStyle = '#F43F5E'
        ctx.fillText(blockKey, xOffset + (width * CELL_SIZE) / 2, yOffset)

        // セル
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
  }, [tickets])

  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      setImageUrl(dataUrl)
    }
  }, [tickets])

  const handleImageClick = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>座席分布</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #f3f4f6;
              }
              img {
                max-width: 100%;
                height: auto;
                background: white;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="座席分布" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return (
    <>
      <div className="overflow-x-auto border p-2 bg-white">
        <canvas ref={canvasRef} className="hidden" />
        <img
          src={imageUrl}
          alt="座席分布"
          className="max-w-full cursor-pointer hover:opacity-80"
          onClick={handleImageClick}
          title="クリックで拡大表示"
        />
      </div>
    </>
  )
}

export default TicketGridCanvas
