"use client";

import styles from "@/styles/mainPage.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sha256 } from "js-sha256";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    fetch("http://localhost:8000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: login, password_hash: sha256(password) }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 500) {
          alert("Login failed. Check your credentials.");
          console.error("Server error during login");
          return;
        } else if (!res.ok) {
          throw new Error("Undefined error during login");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        console.log("Login successful:", data);
        localStorage.setItem("e-mail", login);
        localStorage.removeItem("subject");
        if (data.is_admin) {
          router.push("/adminMain");
        } else {
          router.push("/userMain");
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>📘</div>
      <h1 className={styles.title}>Zmitac 2.0</h1>

      <input
        className={styles.loginInput}
        type="text"
        placeholder="firstname.lastname@school.edu"
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
