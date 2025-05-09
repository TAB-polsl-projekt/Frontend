import styles from '../../../styles/userPage.module.css';
import { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.userLayout}>
      <header className={styles.header}>
        <h1>Student Portal</h1>
      </header>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}