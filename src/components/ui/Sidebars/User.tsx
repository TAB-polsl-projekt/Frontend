// src/components/ui/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import sidebarStyles from '@/styles/sidebar.module.css';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modals/UserSettings';
import SubjectModal from '@/components/ui/Modals/ChangeSubject';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

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
    console.log('Returning to main page');
    router.push('/userMain');
    setIsOpen(false);
  };

  const handleReport = () => {
    console.log('Report clicked');
    router.push('/userMain/report');
    setIsOpen(false);
  };

  const handleSchedule = () => {
    console.log('Schedule clicked');
    // Implement schedule navigation logic here
    router.push('/userMain/schedule');
    setIsOpen(false);
  }

  const handleLogout = () => {
    router.push('/');
  };

  // ROUTER STUFF END
  // MODAL HANDLERS

    const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsSettingsModalOpen(true);
  };

  const handleSubjectChange = () => {
    console.log('Subject change clicked');
    setIsSubjectModalOpen(true);
  };

  // MODAL HANDLERS END
  // THEME TOGGLE

  // THEME TOGGLE END

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
          <button className={sidebarStyles.navButtons} onClick={handleSchedule}>Harmonogram</button>
        </nav>
        <div className={sidebarStyles.bottomLinks}>
          <ThemeSwitcher />
          <button className={sidebarStyles.navButtons} onClick={handleSettingsClick}>Ustawienia</button>
          <button className={sidebarStyles.navButtons} onClick={handleLogout}>Wyloguj</button>
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
