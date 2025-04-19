'use client'

import { useState, useEffect } from 'react'

/**
 * A8.netの広告をカルーセル表示するコンポーネント
 */
const CarouselAds = () => {
  // 現在表示中の広告のインデックス
  const [currentIndex, setCurrentIndex] = useState(0)

  // 広告データの配列
  const ads = [
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453BJZ+ATYYSA+4R8G+5ZEMP",
      imgSrc: "https://www28.a8.net/svt/bgt?aid=250417727655&wid=002&eno=01&mid=s00000022192001005000&mc=1",
      trackingImg: "https://www18.a8.net/0.gif?a8mat=453BJZ+ATYYSA+4R8G+5ZEMP",
      alt: "ナビタイムトラベル 国内線12社対応！当日便もOK"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453D3W+BWPNE+AD2+3H2BC1",
      imgSrc: "https://www27.a8.net/svt/bgt?aid=250419740020&wid=002&eno=01&mid=s00000001343021006000&mc=1",
      trackingImg: "https://www16.a8.net/0.gif?a8mat=453D3W+BWPNE+AD2+3H2BC1",
      alt: "エアトリバス 最安値2000円台"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453BJZ+ALMWBE+1OK+6OP4H",
      imgSrc: "https://www27.a8.net/svt/bgt?aid=250417727641&wid=002&eno=01&mid=s00000000218001123000&mc=1",
      trackingImg: "https://www13.a8.net/0.gif?a8mat=453BJZ+ALMWBE+1OK+6OP4H",
      alt: "一休 ビジネスホテル予約"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453CBR+GI6NA2+4GDM+601S1",
      imgSrc: "https://www24.a8.net/svt/bgt?aid=250418727998&wid=002&eno=01&mid=s00000020785001008000&mc=1",
      trackingImg: "https://www18.a8.net/0.gif?a8mat=453CBR+GI6NA2+4GDM+601S1",
      alt: "K Village Tokyo 「日本最大級」の韓国語教室"
    }
  ]

  // 自動スライド用のタイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden mb-4">
      {/* カルーセル本体 */}
      <div
        className="flex transition-transform duration-500 ease-in-out mb-2"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ads.map((ad, index) => (
          <div key={index} className="w-full flex-shrink-0 items-center mb-2">
            <a className='inline-block w-full' href={ad.href} rel="nofollow" target='_blank'>
              <img alt={ad.alt} src={ad.imgSrc} className="w-full"/>
              <img width="1" height="1" src={ad.trackingImg} alt=""/>
            </a>
          </div>
        ))}
      </div>

      {/* ナビゲーションドット */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3">
        {ads.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-rose-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselAds