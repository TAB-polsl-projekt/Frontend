// src/context/SubjectContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

const SubjectContext = createContext<{
  subject: string;
  setSubject: (subject: string) => void;
} | null>(null);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [subject, setSubject] = useState("");

  return (
    <SubjectContext.Provider value={{ subject, setSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const ctx = useContext(SubjectContext);
  if (!ctx) throw new Error("useSubject must be used within SubjectProvider");
  return ctx;
};
