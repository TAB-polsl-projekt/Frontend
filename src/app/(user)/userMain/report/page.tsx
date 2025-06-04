'use client';

import React from 'react';
import styles from '@/styles/reportPage.module.css';
import { useRouter } from 'next/navigation';

export default function ReportUploadPage() {

  const router = useRouter();

  const handleSubmit = () => {
    // Here you would typically handle the form submission,
    // such as sending the data to an API or processing it.
    // For now, we'll just log a message and redirect.
    console.log('Form submitted');
    router.push('/userMain'); // Redirect to user main page after submission
  }

  return (
    <form className={styles.formContainer}>
      <h1 style={{ color: '#000000', fontSize: 30 }}>Sprawozdanie</h1>

      <label className={styles.label}>Ćwiczenie</label>
      <select className={styles.select}>
        <option>---</option>
        <option>Ćwiczenie 1</option>
        <option>Ćwiczenie 2</option>
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
      <input type="file" accept="application/zip" className={styles.input} />

      <button type="submit" className={styles.button} onClick={handleSubmit}>Wyślij</button>
    </form>
  );
}
