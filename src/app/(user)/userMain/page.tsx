// src/app/(user)/userPage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AssignmentsTable from '@/components/ui/Tables/Assignments';

interface Assignment {
  id: string;
  subject_id: string;
  title: string;
  description: string;
}

interface ApiResponse {
  subject: string;
  assignments: Assignment[];
}

export default function UserPage() {

  const [data, setData] = useState<ApiResponse | null>(null);

  //'/api/subjects/<id>'


  return (
    <div>
      <AssignmentsTable />
    </div>
  );
}
