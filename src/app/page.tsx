"use client";

import styles from "@/styles/mainPage.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  let isAdmin = false;
  const handleLogin = () => {
    router.refresh();
    if (!isAdmin){
      //signIn('azure-ad', {callbackUrl: '/userMain'});
      router.push("/userMain");
    }
    else {
      router.push("/adminMain");
    };
  }
  const flipAdmin = () => {
    isAdmin = !isAdmin;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>📘</div>
      <h1 className={styles.title}>Zmitac 2.0</h1>
      <button className={styles.loginButton} onClick={handleLogin}>
        Login
      </button>
      <input className={styles.checkAdminButton} type="checkbox" id="admin" name="admin" onClick={flipAdmin} />
      <label htmlFor="admin">Admin?</label>
    </div>
  );
}