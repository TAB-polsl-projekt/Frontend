// app/userMain/report/layout.tsx
import React from 'react';

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {children}
    </div>
  );
}