'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/modal.module.css';
import { setSubjectInStorage } from '@/utils/subjectStorage';

interface SubjectModalProps {
  onClose: () => void;
}

interface Subject {
  subject_id: string;
  subject_name: string;
}

export default function SubjectModal({ onClose }: SubjectModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/subjects', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => { 
        if (res.status === 401) {
          alert("Nie masz uprawnień. Zaloguj się ponownie.");
          window.location.href = '/';
        } else if (res.status === 500) {
          alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
          console.error('Server error while fetching subjects in modal');
          return;
        } else if (res.status === 404) {
          console.error('No subjects found in modal');
          onClose();
          return;
        } else if (!res.ok) {
          throw new Error('Undefined error while fetching subjects in modal');
        }
        return res.json() 

      }).then((json: Subject[]) => setSubjects(json));
  }, []);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(event.target.value);
  };

  const handleConfirm = () => {
    const selectedSubject = subjects.find(subject => subject.subject_id === selectedSubjectId);
    if (selectedSubject) {
      setSubject(selectedSubject);
      setSubjectInStorage(selectedSubject);
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
          value={selectedSubjectId}
          onChange={handleSubjectChange}
        >
          <option value="">-- Wybierz przedmiot --</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Zatwierdź
        </button>
      </div>
    </div>
  );
}
