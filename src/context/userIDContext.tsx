// src/context/userIDContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  sessionId: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/account`, { method: 'GET', credentials: 'include' });
      if (res.status === 401) {
        alert("Nie masz uprawnień. Zaloguj się ponownie.");
        window.location.href = '/';
      } else if (res.status === 404) {
        alert("Nie znaleziono użytkownika. Zaloguj się ponownie.");
        window.location.href = '/';
      } else if (res.status === 500) {
        alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
        console.error('Server error while refreshing user');
        return;
      } else if (!res.ok) {
        throw new Error('Undefined error while refreshing user');
      }
      
      const data = await res.json();
      setUserId(data.user_id);

      const cookies = document.cookie.split('; ');
      const sessionCookie = cookies.find((c) => c.startsWith('session_id='));
      const sessionValue = sessionCookie?.split('=')[1] ?? null;
      setSessionId(sessionValue);
    } catch (err) {
      setUserId(null);
      setSessionId(null);
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <UserContext.Provider value={{ userId, sessionId, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
