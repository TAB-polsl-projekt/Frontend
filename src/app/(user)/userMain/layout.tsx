// src/app/(user)/userPage/layout.tsx
'use client';
import React from 'react';
import Sidebar from '@/components/ui/Sidebars/User';
import userStyles from '@/styles/userPage.module.css';
import Footer from '@/components/ui/Footer';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={userStyles.container}>
      <Sidebar />
      <main className={userStyles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
