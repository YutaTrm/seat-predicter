'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function LoginForm() {
  const router = useRouter()

  // このページは使用しないため、トップページにリダイレクト
  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">リダイレクト中...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}