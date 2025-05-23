// src/components/ui/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import styles from '@/styles/userPage.module.css';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/UserSettingsModal';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    console.log('returned null');
    return null
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleReport = () => {
    router.push('/userMain/report');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log('Theme changed to:', theme === 'light' ? 'dark' : 'light');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsModalOpen(true);
  };

  return (
    <>
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <nav className={styles.navLinks}>
          <a href="#">Zmień przedmiot</a>
          <button onClick={handleReport}>Wyślij sprawozdanie</button>
          <a href="#">Harmonogram</a>
        </nav>
        <div className={styles.bottomLinks}>
            {mounted && (
            <button onClick={toggleTheme}>
              {theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
            </button>
          )}
          <button onClick={() => handleSettingsClick()}>Ustawienia</button>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      </div>
      {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}/>)}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}
