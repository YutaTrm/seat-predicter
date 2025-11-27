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
      href: "https://www.amazon.co.jp/blackfriday?_encoding=UTF8&pd_rd_w=ZtM1I&content-id=amzn1.sym.6206ea79-0335-4e2c-9cab-258fd3e8bd02&pf_rd_p=6206ea79-0335-4e2c-9cab-258fd3e8bd02&pf_rd_r=Z4TJN4NDBN3ZES6Z5K09&pd_rd_wg=c6k7H&pd_rd_r=e368b93f-0f43-4594-a395-b872bbffa205&linkCode=ll2&tag=murakumo0079-22&linkId=8f084f0154c572ffda9df5a9aa69ce4f&language=ja_JP&ref_=as_li_ss_tl",
      imgSrc: "https://zasekiyosou.com/images/amazon_banner.jpg",
      trackingImg: "",
      alt: "アマゾンブラックフライデー"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=45I9PE+CFQ0GQ+2QOI+66WOX",
      imgSrc: "https://www21.a8.net/svt/bgt?aid=251115170752&wid=002&eno=01&mid=s00000012789001040000&mc=1",
      trackingImg: "https://www13.a8.net/0.gif?a8mat=45I9PE+CFQ0GQ+2QOI+66WOX",
      alt: "K-POPグッズの宅配買取【推しトク】"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453CBS+IGHAY+51XQ+614CX",
      imgSrc: "https://www26.a8.net/svt/bgt?aid=250418728031&wid=002&eno=01&mid=s00000023579001013000&mc=1",
      trackingImg: "https://www10.a8.net/0.gif?a8mat=453CBS+IGHAY+51XQ+614CX",
      alt: "韓国語オンラインスクール 入会金今なら0円"
    },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453BJZ+9711WA+4X1W+5ZEMP",
      imgSrc: "https://www20.a8.net/svt/bgt?aid=250417727556&wid=002&eno=01&mid=s00000022946001005000&mc=1",
      trackingImg: "https://www12.a8.net/0.gif?a8mat=453BJZ+9711WA+4X1W+5ZEMP",
      alt: "アゴダでお得に旅しよう"
    },
    // {
    //   href: "https://px.a8.net/svt/ejp?a8mat=453BJZ+ATYYSA+4R8G+5ZEMP",
    //   imgSrc: "https://www28.a8.net/svt/bgt?aid=250417727655&wid=002&eno=01&mid=s00000022192001005000&mc=1",
    //   trackingImg: "https://www18.a8.net/0.gif?a8mat=453BJZ+ATYYSA+4R8G+5ZEMP",
    //   alt: "ナビタイムトラベル 国内線12社対応！当日便もOK"
    // },
    {
      href: "https://px.a8.net/svt/ejp?a8mat=453D3W+BWPNE+AD2+3H2BC1",
      imgSrc: "https://www27.a8.net/svt/bgt?aid=250419740020&wid=002&eno=01&mid=s00000001343021006000&mc=1",
      trackingImg: "https://www16.a8.net/0.gif?a8mat=453D3W+BWPNE+AD2+3H2BC1",
      alt: "エアトリバス 最安値2000円台"
    },
    // {
    //   href: "https://px.a8.net/svt/ejp?a8mat=453BJZ+ALMWBE+1OK+6OP4H",
    //   imgSrc: "https://www27.a8.net/svt/bgt?aid=250417727641&wid=002&eno=01&mid=s00000000218001123000&mc=1",
    //   trackingImg: "https://www13.a8.net/0.gif?a8mat=453BJZ+ALMWBE+1OK+6OP4H",
    //   alt: "一休 ビジネスホテル予約"
    // },
    // {
    //   href: "https://px.a8.net/svt/ejp?a8mat=453CBR+GI6NA2+4GDM+601S1",
    //   imgSrc: "https://www24.a8.net/svt/bgt?aid=250418727998&wid=002&eno=01&mid=s00000020785001008000&mc=1",
    //   trackingImg: "https://www18.a8.net/0.gif?a8mat=453CBR+GI6NA2+4GDM+601S1",
    //   alt: "K Village Tokyo 「日本最大級」の韓国語教室"
    // }
  ]

  // 自動スライド用のタイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden text-center mb-4">
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