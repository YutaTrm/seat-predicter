import React from 'react';
import InfoList from '../components/home/InfoList';

export default function InfoPage() {
  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8 text-md">
      <h1 className="text-2xl font-bold text-rose-500 mb-6 text-center">更新情報</h1>
      <InfoList/>
    </main>
  );
}