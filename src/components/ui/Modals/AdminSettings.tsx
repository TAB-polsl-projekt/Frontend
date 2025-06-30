// src/components/ui/UserSettingsModal.tsx
'use client';

import React, { useState } from 'react';
import styles from '@/styles/modal.module.css';
import { useUser } from '@/context/userIDContext';
import { sha256 } from 'js-sha256';

interface ModalProps {
  onClose: () => void;
}

export default function AdminSettingsModal({ onClose }: ModalProps) {

  const [email, setEmail] = useState(localStorage.getItem('e-mail') ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userId } = useUser();

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
      if (response.status === 400) {
        alert('Błędne dane logowania. Sprawdź swoje hasło.');
        return;
      } else if (response.status === 401) {
        alert('Nie masz uprawnień. Zaloguj się ponownie.');
        window.location.href = '/';
      } else if (response.status === 403) {
        alert('Nie masz uprawnień do tej operacji.');
        return;
      } else if (response.status === 500) {
        alert('Wystąpił błąd serwera. Spróbuj ponownie później.');
        console.error('Server error while updating user settings');
      }
      else if (!response.ok) {
        throw new Error('Undefined error while updating user settings');
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
