"use client";

import styles from "@/styles/mainPage.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password.includes("admin")) {
      router.push("/adminMain");
    } else {
      router.push("/userMain");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>📘</div>
      <h1 className={styles.title}>Zmitac 2.0</h1>

      <input
        className={styles.loginInput}
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className={styles.loginInput}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
