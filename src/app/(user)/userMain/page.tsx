// src/app/(user)/userPage/page.tsx
'use client';

import React, { useState } from 'react';
import userStyles from '@/styles/userPage.module.css';
import Modal from '@/components/ui/Modals/Generic';
import { useSubject } from '@/context/SubjectContext';

export default function UserPage() {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedString, setSelectedString] = useState('');
  const {subject} = useSubject();

  const handleExerciseClick = (exercise: string) => {
    setSelectedString(exercise);
    setIsSubjectModalOpen(true);
  };

  const handleReportClick = (report: string) => {
    setSelectedString(report);
    setIsSubjectModalOpen(true);
  };

  return (
    <div className={userStyles.dashboard}>
      <h1 className={userStyles.title}>Twoje Ćwiczenia z przedmiotu: {subject}</h1>
      <table className={userStyles.table}>
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
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 1')}>
                Ćwiczenie 1: Kombinacyjne automaty cyfrowe
              </button>
            </td>
            <td>3.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 1')}>
              Zaliczone
              </button>
            </td>
            <td>3.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 3')}>
                Ćwiczenie 3: Elementarne automaty sekwencyjne
              </button>
            </td>
            <td>2.0</td>
            <td>3.5</td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 3')}>
              Zaliczone
              </button>
            </td>
            <td>2.75</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 4')}>
                Ćwiczenie 4: Asynchroniczne automaty sekwencyjne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 4')}>
              Zaliczone
              </button>
            </td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 5')}>
                Ćwiczenie 5: Synchroniczne automaty sekwencyjne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 5')}>
              Zaliczone
              </button>
            </td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 6')}>
                Ćwiczenie 6: Wybrane układy arytmetyczne
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 6')}>
              Zaliczone
              </button>
            </td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 7')}>
                Ćwiczenie 7: Dynamika układów cyfrowych
              </button>
            </td>
            <td>3.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 7')}>
              Zaliczone
              </button>
            </td>
            <td>3.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 9 i 10')}>
                Ćwiczenie 9 i 10: Rejestry i liczniki
              </button>
            </td>
            <td>5.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 9 i 10')}>
              Zaliczone
              </button>
            </td>
            <td>5.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 11')}>
                Ćwiczenie 11: Komutatory
              </button>
            </td>
            <td>4.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 11')}>
              Zaliczone
              </button>
            </td>
            <td>4.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 12')}>
                Ćwiczenie 12: Elementy komputerowo wspomaganego projektowania automatów cyfrowych
              </button>
            </td>
            <td>4.0</td>
            <td></td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 12')}>
              Zaliczone
              </button>
            </td>
            <td>4.0</td>
          </tr>
          <tr>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleExerciseClick('Ćwiczenie 14')}>
                Ćwiczenie 14: Mikroprogramowalne sekwencyjne automaty cyfrowe
              </button>
            </td>
            <td>2.0</td>
            <td>3.5</td>
            <td>Obecny</td>
            <td>
              <button className={userStyles.linkButton} onClick={() => handleReportClick('Sprawozdanie ćw 14')}>
              Zaliczone
              </button>
            </td>
            <td>2.75</td>
          </tr>
        </tbody>
      </table>
      {isSubjectModalOpen && (
        <Modal onClose={() => setIsSubjectModalOpen(false)}>
          <h2>{selectedString}</h2>
          <p>Szczegółowe informacje o ćwiczeniu/sprawozdaniu.</p>
        </Modal>
      )}
    </div>
  );
}
