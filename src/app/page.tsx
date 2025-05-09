"use client";

import styles from "../styles/mainPage.module.css";
""
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.refresh();
    router.push("/userPage");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>📘</div>
      <h1 className={styles.title}>Zmitac 2.0</h1>
      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}