import React from 'react';
import SectionHeader from '../components/common/SectionHeader';
import InfoList from '../components/home/InfoList';

export default function InfoPage() {
  return (
    <main className="container mx-auto h-screen overflow-y-auto min-h-screen px-4 py-8 text-md">
      <SectionHeader title="更新情報" />
      <InfoList/>
    </main>
  );
}