// src/components/ui/Footer.tsx
import React from 'react';
import styles from '@/styles/userPage.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Jeżeli to czytasz to zostałeś prawnikiem.</p>
    </footer>
  );
}
