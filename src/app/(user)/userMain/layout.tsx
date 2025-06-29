// src/app/(user)/userPage/layout.tsx
'use client';
import React from 'react';
import Sidebar from '@/components/ui/Sidebars/User';
import userStyles from '@/styles/userPage.module.css';
import Footer from '@/components/ui/Footer';
import { SubjectProvider } from '@/context/SubjectContext';
import { UserProvider, useUser } from '@/context/userIDContext';


function InnerLayout({ children }: { children: React.ReactNode }) {
  const {refreshUser} = useUser();

  React.useEffect(() => {
    // Refresh user data on component mount
    refreshUser();
  }, [refreshUser]);

  return (
    <>
      <Sidebar />
      <main className={userStyles.mainContent}>{children}</main>
      <Footer />
    </>
  );
}

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  

  return (
    <div className={userStyles.container}>
      <UserProvider>
        <SubjectProvider>
          <InnerLayout>
            {children}
          </InnerLayout>
        </SubjectProvider>
      </UserProvider>
    </div>
  );
}
