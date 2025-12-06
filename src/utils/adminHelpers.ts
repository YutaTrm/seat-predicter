'use client'

/**
 * 確認ダイアログ付きの削除処理を実行する共通関数
 */
export const deleteWithConfirm = async (
  id: number,
  entityName: string,
  handleDelete: (formData: FormData) => Promise<{ success: boolean }>
): Promise<void> => {
  if (!confirm(`この${entityName}を削除してもよろしいですか？`)) {
    throw new Error('キャンセルされました')
  }

  const formData = new FormData()
  formData.append('id', id.toString())

  try {
    await handleDelete(formData)
  } catch (err) {
    console.error(`${entityName}削除エラー:`, err)
    throw new Error(`${entityName}の削除に失敗しました`)
  }
}
