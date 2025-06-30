// src/components/ui/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import sidebarStyles from '@/styles/sidebar.module.css';
import { useRouter } from 'next/navigation';
import UserSettingsModal from '@/components/ui/Modals/UserSettings';
import SubjectModal from '@/components/ui/Modals/ChangeSubject';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    console.log('returned null');
    return null
  };

  // ROUTER STUFF

  const handleReturnToMain = () => {
    router.push('/userMain');
    setIsOpen(false);
  };

  const handleReport = () => {
    router.push('/userMain/report');
    setIsOpen(false);
  };

  const handleLogout = () => {
    fetch('http://localhost:8000/api/auth', {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      if (res.status === 401) {
        alert("Nie masz uprawnień.");
        return;
      } else if (res.status === 500) {
        alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
        console.error('Server error during logout');
        return;
      }
      Cookies.remove('session_id');
      localStorage.removeItem('e-mail');
      router.push('/');
    })
  };

  // ROUTER STUFF END
  // MODAL HANDLERS

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleSubjectChange = () => {
    setIsSubjectModalOpen(true);
  };

  // MODAL HANDLERS END

  return (
    <div>
      <button className={sidebarStyles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`${sidebarStyles.sidebar} ${isOpen ? sidebarStyles.sidebarOpen : ''}`}>
        <nav className={sidebarStyles.navLinks}>
          <button className={sidebarStyles.navButtons} onClick={handleReturnToMain}>Strona główna</button>
          <button className={sidebarStyles.navButtons} onClick={handleSubjectChange}>Zmień przedmiot</button>
          <button className={sidebarStyles.navButtons} onClick={handleReport}>Wyślij sprawozdanie</button>
        </nav>
        <div className={sidebarStyles.bottomLinks}>
          <button className={sidebarStyles.navButtons} onClick={handleSettingsClick}>Ustawienia</button>
          <button className={sidebarStyles.navButtons} onClick={handleLogout}>Wyloguj</button>
        </div>
      </div>
      {isSettingsModalOpen && (
        <UserSettingsModal onClose={() => setIsSettingsModalOpen(false)} />)}
      {isOpen && <div className={sidebarStyles.overlay} onClick={() => setIsOpen(false)} />}
      {isSubjectModalOpen && (
        <SubjectModal onClose={() => setIsSubjectModalOpen(false)} />
      )}
    </div>
  );
}
