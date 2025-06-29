// src/context/SubjectContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface Subject {
  subject_id: string;
  subject_name: string;
}

const SubjectContext = createContext<{
  subject: Subject;
  setSubject: (subject: Subject) => void;
} | null>(null);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [subject, setSubject] = useState<Subject>({
    subject_id: "",
    subject_name: "",
    });

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
