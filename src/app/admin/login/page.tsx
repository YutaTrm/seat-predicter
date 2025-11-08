'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { signInWithTwitter } from '@/lib/supabase/auth'

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTwitterLoading, setIsTwitterLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // セッションをチェックして、既にログインしている場合はリダイレクト
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const redirectUrl = searchParams.get('redirect') || '/admin'
        router.push(redirectUrl)
      }
    }
    checkSession()
  }, [router, searchParams, supabase.auth])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      if (data.session) {
        // セッションが正常に作成された場合
        const redirectUrl = searchParams.get('redirect') || '/admin'
        router.push(redirectUrl)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwitterSignIn = async () => {
    setError(null)
    setIsTwitterLoading(true)

    try {
      const redirectUrl = searchParams.get('redirect') || '/admin'
      await signInWithTwitter(redirectUrl)
    } catch (error) {
      console.error('Twitter login error:', error)
      setError('Xログインに失敗しました。もう一度お試しください。')
      setIsTwitterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">管理者ログイン</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Xログインボタン */}
        <button
          onClick={handleTwitterSignIn}
          className={`bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4 flex items-center justify-center gap-2 ${
            isTwitterLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isTwitterLoading || isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {isTwitterLoading ? 'Xでログイン中...' : 'Xでログイン'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isLoading || isTwitterLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isLoading || isTwitterLoading}
            />
          </div>
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              isLoading || isTwitterLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading || isTwitterLoading}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            一般ユーザーの方はこちら
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
