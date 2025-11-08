import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
}

/**
 * セクションのヘッダーコンポーネント
 * 戻るボタンとタイトルを表示する
 * @param {string} title - セクションのタイトル
 * @returns {JSX.Element} セクションヘッダーを表示するコンポーネント
 */
export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 text-xl">
      <Link
        href="/"
        className="text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="トップページに戻る"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
      </Link>
      <h1 className="font-bold text-rose-500">{title}</h1>
      <span>　</span>
    </div>
  );
}