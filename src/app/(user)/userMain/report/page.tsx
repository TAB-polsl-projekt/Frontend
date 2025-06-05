'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/reportPage.module.css';
import { useRouter } from 'next/navigation';
import { useSubject } from '@/context/SubjectContext';

interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description: string;
}

export default function ReportUploadPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { subject } = useSubject();
  const [assignmentId, setAssignmentId] = useState<string>('');
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    if (!subject?.subject_id) return;

  fetch(`../JSON_API_Endpoint_Data/api-subjects-id.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch assignments');
      }
      return res.json();
    })
    .then((data) => {
      setAssignments(data.assignments || []);
    })
    .catch((error) => {
      console.error('Error fetching assignments:', error);
    });
}, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentId || !zipFile) {
      alert('Proszę wybrać ćwiczenie i załączyć plik ZIP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const response = await fetch(`/api/assignments/${assignmentId}/solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
      });

      if (response.ok) {
        alert('Sprawozdanie zostało przesłane pomyślnie.');
        router.push('/userMain');
      } else {
        alert('Wystąpił błąd podczas przesyłania sprawozdania.');
      }
    };
    reader.readAsArrayBuffer(zipFile);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h1 style={{ color: '#000000', fontSize: 30 }}>Sprawozdanie</h1>

      <label className={styles.label}>Ćwiczenie</label>
      <select
        className={styles.select}
        value={assignmentId}
        onChange={(e) => setAssignmentId(e.target.value)}
        required
      >
        <option value="">-- Wybierz ćwiczenie --</option>
        {assignments.map((assignment) => (
          <option key={assignment.assignment_id} value={assignment.assignment_id}>
            {assignment.title}
          </option>
        ))}
      </select>

      <label className={styles.label}>Prowadzący</label>
      <select className={styles.select}>
        <option>---</option>
        <option>Dr Kowalski</option>
        <option>Mgr Nowak</option>
      </select>

      <label className={styles.label}>Data odbycia ćwiczenia</label>
      <input type="date" className={styles.input} />

      <label className={styles.label}>Podsekcja</label>
      <input type="text" className={styles.input} />

      <label className={styles.label}>Skład:</label>
      <div className={styles.checkboxGroup}>
        {Array.from({ length: 10 }).map((_, i) => (
          <label key={i}>
            <input type="checkbox" /> {i + 1}
          </label>
        ))}
      </div>

      <label className={styles.label}>Uwagi:</label>
      <textarea rows={4} className={styles.textarea} />

      <label className={styles.label}>Wersja:</label>
      <input type="number" defaultValue={1} min={1} className={styles.input} />

      <label className={styles.label}>Plik ZIP:</label>
      <input
        type="file"
        accept="application/zip"
        className={styles.input}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setZipFile(e.target.files[0]);
          }
        }}
        required
      />

      <button type="submit" className={styles.button}>
        Wyślij
      </button>
    </form>
  )
}
