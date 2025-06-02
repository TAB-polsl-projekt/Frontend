// src/components/ui/SubjectModal.tsx
'use client';

import React, { useState } from 'react';
import styles from '@/styles/modal.module.css';
import { useSubject } from '@/context/SubjectContext';

interface SubjectModalProps {
  onClose: () => void;
}

export default function SubjectModal({ onClose }: SubjectModalProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const { setSubject } = useSubject();


  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setSubject(event.target.value);
  };

  const handleConfirm = () => {
    if (selectedSubject) {
      console.log('Wybrany przedmiot:', selectedSubject);
      // Tutaj możesz dodać logikę zmiany przedmiotu
      onClose();
    } else {
      alert('Proszę wybrać przedmiot.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Wybierz przedmiot</h2>
        <select
          className={styles.selectInput}
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">-- Wybierz przedmiot --</option>
          <option value="SMIW Laby">SMIW Laby</option>
          <option value="TUC Laby">TUC Laby</option>
        </select>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Zatwierdź
        </button>
      </div>
    </div>
  );
}
