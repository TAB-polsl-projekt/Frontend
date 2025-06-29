// src/components/ui/UserSettingsModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/modal.module.css';
import { useUser } from '@/context/userIDContext';
import { sha256 } from 'js-sha256';

interface ModalProps {
  onClose: () => void;
}

export default function UserSettingsModal({ onClose }: ModalProps) {

  const [email, setEmail] = useState(localStorage.getItem('e-mail') ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userId, sessionId } = useUser();

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Nowe hasło i potwierdzenie hasła nie są zgodne.');
      return;
    }

    fetch(`http://localhost:8000/api/users/${userId}/login`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        passwd_hash: sha256(newPassword),
        old_passwd_hash: sha256(currentPassword),
      }),
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        alert('Nie udało się zaktualizować ustawień użytkownika. Sprawdź swoje dane.');
        throw new Error('Failed to update user settings');
      }
      localStorage.setItem('e-mail', email);
      return response.json();
    });

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
