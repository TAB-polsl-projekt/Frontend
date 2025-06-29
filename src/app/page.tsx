"use client";

import styles from "@/styles/mainPage.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { sha256 } from "js-sha256";
import { useUserData } from "@/context/userE-mailContext";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { setEmail } = useUserData();

  const handleLogin = () => {

    fetch("http://localhost:8000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: login, password_hash: sha256(password) }),
      credentials: "include", // Include cookies in the request
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        setEmail(login);
        Cookies.set("session_id", data.session_id, { expires: 1 }); // Set cookie for 1 day
        if (data.is_admin) {
          router.push("/adminMain");
        } else {
          router.push("/userMain");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Login failed. Please check your credentials.");
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
