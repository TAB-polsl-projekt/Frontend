// src/app/(user)/userPage/layout.tsx
'use client';
import React from 'react';
import Sidebar from '@/components/ui/Sidebars/User';
import userStyles from '@/styles/userPage.module.css';
import Footer from '@/components/ui/Footer';
import { SubjectProvider } from '@/context/SubjectContext';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={userStyles.container}>
      <SubjectProvider>
        <Sidebar />
          <main className={userStyles.mainContent}>{children}</main>
        <Footer />
      </SubjectProvider>
    </div>
  );
}
