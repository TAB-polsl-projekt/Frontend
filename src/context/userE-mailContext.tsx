'use client';

import React, { createContext, useContext, useState } from 'react';

interface UserDataContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);

  const refreshUserData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/account`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();

      console.log('UserDataContext user data:', data);
      setEmail(data.email);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      setEmail(null);
    }
  };

  return (
    <UserDataContext.Provider
      value={{ email, setEmail, refreshUserData }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
