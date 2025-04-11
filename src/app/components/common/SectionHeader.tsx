import React from 'react';
import Link from 'next/link';
import Icon from './Icon';

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
        <Icon type='prev'/>
      </Link>
      <h1 className="font-bold text-rose-500">{title}</h1>
      <span>　</span>
    </div>
  );
}