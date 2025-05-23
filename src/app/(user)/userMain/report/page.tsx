"use client";

import React from 'react';
import styles from '@/styles/reportPage.module.css';
import { useRouter } from 'next/navigation';

export default function ReportPage() {

    const router = useRouter();

  return (
    <div>
      <h1 className={styles.text}>Sprawozdanie</h1>
      <p className={styles.text}>Tu będzie formularz do wysyłania sprawozdań.</p>
      <form>
        <label className={styles.text} htmlFor="report">Wybierz plik:</label>
        <input className={styles.text} type="file" id="report" name="report" accept="application/pdf" />
        <button className={styles.text} type="submit">Wyślij</button>
      </form>
      <br></br>
      <button className={styles.text} onClick={() => router.push('/userMain')}>Powrót</button> 
    </div>
  );
}