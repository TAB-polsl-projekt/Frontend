// src/context/userIDContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();
      setUserId(data.user_id);

      const cookies = document.cookie.split('; ');
      const sessionCookie = cookies.find((c) => c.startsWith('session_id='));
      const sessionValue = sessionCookie?.split('=')[1] ?? null;
      setSessionId(sessionValue);
    } catch (err) {
      setUserId(null);
      setSessionId(null);
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
