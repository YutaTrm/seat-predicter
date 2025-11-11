import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import type { Metadata } from 'next';
import Footer from '../components/common/Footer';

export const metadata: Metadata = {
  title: 'ライセンス情報 | 座席予想掲示板',
  description: '座席予想掲示板で使用しているライブラリのライセンス情報について',
};

export default function LicensePage() {
    return (
      <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-6 text-md">
        <SectionHeader title="Licenses and Attributions" />

        <p className="text-gray-600 leading-relaxed mb-4">
          This web application was built using the following open-source software:
        </p>

        <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed mb-4">
          <li>
            <strong>Next.js</strong> – Licensed under the{' '}
            <a
              href="https://github.com/vercel/next.js/blob/canary/license"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>.
          </li>
          <li>
            <strong>Tailwind CSS</strong> – Licensed under the{' '}
            <a
              href="https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>.
          </li>
          <li>
            <strong>Supabase</strong> – Licensed under the{' '}
            <a
              href="https://github.com/supabase/supabase/blob/master/LICENSE"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>.
          </li>
        </ul>

        <p className="text-gray-600 leading-relaxed mb-8">
          All third-party packages used in this project retain their respective licenses and copyrights.
          <br />
          This application’s source code is also released under the MIT License unless otherwise noted.
        </p>
        <Footer/>
      </main>
    );
  }