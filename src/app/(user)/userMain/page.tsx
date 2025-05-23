// src/app/(user)/userPage/page.tsx
'use client';

import React, { useState } from 'react';
import styles from '@/styles/userPage.module.css';
import Modal from '@/components/ui/Modal';

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');

  const handleExerciseClick = (exercise: string) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
};

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Twoje Ćwiczenia</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ćwiczenie</th>
            <th>Termin 1</th>
            <th>Poprawa</th>
            <th>Obecność</th>
            <th>Sprawozdanie</th>
            <th>Ocena</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 1')}>
                Ćwiczenie 1: Kombinacyjne automty cyfrowe
              </button>
            </td>
            <td>3.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>3.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 3')}>
                Ćwiczenie 3: Elementarne automaty sekwencyjne
              </button>
            </td>
            <td>2.0</td>
            <td>3.5</td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>2.75</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 4')}>
                Ćwiczenie 4: Asynchroniczne automaty sekwencyjne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 5')}>
                Ćwiczenie 5: Synchroniczne automaty sekwencyjne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 6')}>
                Ćwiczenie 6: Wybrane układy arytmetyczne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 7')}>
                Ćwiczenie 7: Dynamika układów cyfrowych
              </button>
            </td>
            <td>3.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>3.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 9 i 10')}>
                Ćwiczenie 9 i 10: Rejestry i liczniki
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 11')}>
                Ćwiczenie 11: Komutatory
              </button>
            </td>
            <td>4.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>4.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 12')}>
                Ćwiczenie 12: Elementy komputerowo wspomaganego projektowania automatów cyfrowych
              </button>
            </td>
            <td>4.0</td>
            <td></td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>4.0</td>
          </tr>
          <tr>
            <td>
              <button className={styles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 14')}>
                Ćwiczenie 14: Mikroprogramowalne sekwencyjne automaty cyfrowe
              </button>
            </td>
            <td>2.0</td>
            <td>3.5</td>
            <td>Obecny</td>
            <td>Zaliczone</td>
            <td>2.75</td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>{selectedExercise}</h2>
          <p>Szczegółowe informacje o ćwiczeniu.</p>
        </Modal>
      )}
    </div>
  );
}
