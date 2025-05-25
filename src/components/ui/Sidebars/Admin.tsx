// src/components/ui/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import sidebarStyles from '@/styles/sidebar.module.css';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modals/UserSettings';
import SubjectModal from '@/components/ui/Modals/ChangeSubject';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
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
    console.log('ADMIN Returning to main page');
    router.push('/adminMain');
    setIsOpen(false);
  };

  const handleReport = () => {
    console.log('ADMIN Report clicked');
    router.push('/adminMain/report');
    setIsOpen(false);
  };

  const handleSchedule = () => {
    console.log('ADMIN Schedule clicked');
    // Implement schedule navigation logic here
    router.push('/adminMain/schedule');
    setIsOpen(false);
  }

  const handleLogout = () => {
    router.push('/');
  };

  // ROUTER STUFF END
  // MODAL HANDLERS

    const handleSettingsClick = () => {
    console.log('ADMIN Settings clicked');
    setIsSettingsModalOpen(true);
  };

  const handleSubjectChange = () => {
    console.log('ADMIN Subject change clicked');
    setIsSubjectModalOpen(true);
  };

  // MODAL HANDLERS END
  // THEME TOGGLE

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log('ADMIN Theme changed to:', theme === 'light' ? 'dark' : 'light');
  };

  // THEME TOGGLE END

  return (
    <div>
      <button className={sidebarStyles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`${sidebarStyles.sidebar} ${isOpen ? sidebarStyles.sidebarOpen : ''}`}>
        <nav className={sidebarStyles.navLinks}>
          <button onClick={handleReturnToMain}>Strona główna</button>
          <button onClick={handleSubjectChange}>Zmień przedmiot</button>
          <button onClick={handleReport}>Wyślij sprawozdanie</button>
          <button onClick={handleSchedule}>Harmonogram</button>
        </nav>
        <div className={sidebarStyles.bottomLinks}>
            {mounted && (
            <button onClick={toggleTheme}>
              {theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
            </button>
          )}
          <button onClick={() => handleSettingsClick()}>Ustawienia</button>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      </div>
      {isSettingsModalOpen && (
                <Modal onClose={() => setIsSettingsModalOpen(false)}/>)}
      {isOpen && <div className={sidebarStyles.overlay} onClick={() => setIsOpen(false)} />}
      {isSubjectModalOpen && (
        <SubjectModal onClose={() => setIsSubjectModalOpen(false)} />
      )}
    </div>
  );
}
