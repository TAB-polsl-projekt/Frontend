// src/app/(user)/userPage/layout.tsx
'use client';
import React from 'react';
import Sidebar from '@/components/ui/Sidebars/Admin';
import styles from '@/styles/adminPage.module.css';
import Footer from '@/components/ui/Footer';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
