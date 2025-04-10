/**
 * お知らせ一覧を表示するコンポーネント
 */
export default function InfoList() {
  // お知らせ情報の配列
  const infoItems = [
    // 新しいお知らせはここに追加
    {date: '2025/04/08',content: 'アーティストに「SEVENTEEN」を追加'},
    {date: '　　　　　　',content: 'ツアーに「HOLIDAY[大阪]」を追加'},
    {date: '　　　　　　',content: 'ツアーに「HOLIDAY[埼玉]」を追加'},
    {date: '2025/04/08',content: 'アーティストに「Stray Kids」を追加'},
    {date: '　　　　　　',content: 'ツアーに「dominATE JAPAN[静岡]」を追加'},
    {date: '2025/04/08',content: 'アーティストに「NCT127」を追加'},
    {date: '　　　　　　',content: 'ツアーに「NEO CITY:JAPAN-THE MOMENTUM[東京]」を追加'},
  ]

  return (
    <dl className="space-y-2">
      {infoItems.map((item, index) => (
        <dl key={index} className="flex gap-2 text-sm">
          <dt className="text-gray-500 mr-2">{item.date}</dt>
          <dd>{item.content}</dd>
        </dl>
      ))}
    </dl>
  )
}