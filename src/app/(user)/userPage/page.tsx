import styles from '../../../styles/userPage.module.css';

export default function UserDashboard() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.section}>
        <h2>Your Subjects</h2>
        <ul className={styles.list}>
          <li>Mathematics</li>
          <li>Physics</li>
          <li>Chemistry</li>
        </ul>
      </section>
      <section className={styles.section}>
        <h2>Recent Grades</h2>
        <ul className={styles.list}>
          <li>Math Test 1: 85%</li>
          <li>Physics Lab: 90%</li>
          <li>Chemistry Quiz: 78%</li>
        </ul>
      </section>
    </div>
  );
}