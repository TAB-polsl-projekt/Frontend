// src/components/ui/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import styles from '@/styles/userPage.module.css';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log('Theme changed to:', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <nav className={styles.navLinks}>
          <a href="#">Zmień przedmiot</a>
          <a href="#">Wyślij sprawozdanie</a>
        </nav>
        <div className={styles.bottomLinks}>
            {mounted && (
            <button onClick={toggleTheme}>
              {theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
            </button>
          )}
          <a href="#">Ustawienia</a>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}
