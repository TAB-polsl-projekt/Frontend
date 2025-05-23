// src/components/ui/UserSettingsModal.tsx
'use client';

import React, { useState } from 'react';
import styles from '@/styles/userPage.module.css';

interface ModalProps {
  onClose: () => void;
}

export default function UserSettingsModal({ onClose }: ModalProps) {
  const [email, setEmail] = useState('');
  const [albumNumber, setAlbumNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dodaj logikę walidacji i aktualizacji danych użytkownika
    console.log('Email:', email);
    console.log('Numer albumu:', albumNumber);
    console.log('Aktualne hasło:', currentPassword);
    console.log('Nowe hasło:', newPassword);
    console.log('Potwierdzenie hasła:', confirmPassword);
    // Zamknij modal po zakończeniu
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h1>Ustawienia użytkownika</h1>
        <form onSubmit={handleSubmit} className={styles.settingsForm}>
          <label>
            Adres e-mail:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Numer albumu:
            <input
              type="text"
              value={albumNumber}
              onChange={(e) => setAlbumNumber(e.target.value)}
              required
            />
          </label>
          <label>
            Aktualne hasło:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Nowe hasło:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Potwierdź nowe hasło:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Zapisz zmiany</button>
        </form>
      </div>
    </div>
  );
}
