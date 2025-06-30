'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/reportPage.module.css';
import { useRouter } from 'next/navigation';
import { getSubjectInStorage } from '@/app/utils/subjectStorage';

interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description: string;
}

type Role = {
  role_id: string;
  name: string;
};

type User = {
  user_id: string;
  full_name: string;
  student_id: string;
};

export default function ReportUploadPage() {
  const router = useRouter();

  const [subject, setSubject] = useState<{ subject_id: string; subject_name: string } | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState<string>('');

  const [teachers, setTeachers] = useState<{full_name: string; user_id: string}[]>([]);
  const [teacher, setTeacher] = useState<{full_name: string; user_id: string}>({full_name: '', user_id: ''});

  const [studentComment, setStudentComment] = useState<string>('');
  const [excerciseDate, setExerciseDate] = useState<string>('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [selectedCoAuthors, setSelectedCoAuthors] = useState<string[]>([]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>();
  const [students, setStudents] = useState<User[]>([]);


  const [user_id, setUserId] = useState<string>();

  useEffect(() => {
    const updateSubject = () => {
      const parsed = getSubjectInStorage();
      setSubject(parsed);
    };

    updateSubject(); // Initial fetch
    window.addEventListener('subjectChanged', updateSubject);
    return () => {
      window.removeEventListener('subjectChanged', updateSubject);
    };
  }, []);

  useEffect(() => {
    if (!subject?.subject_id) return;

    setTeacher({full_name: '', user_id: ''}); // Reset teacher when subject changes

    fetch(`http://localhost:8000/api/subject/${subject?.subject_id}/teachers`, {
      method: 'GET',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch teachers');
      }
      return res.json();
    }).then((data) => {
      setTeachers(data)
    }).catch((error) => {
      console.error('Error fetching teachers:', error)
    });
  }, [subject?.subject_id]);

  useEffect(() => {

    fetch(`http://localhost:8000/api/subjects/${subject?.subject_id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch assignments');
        }
        return res.json();
      })
      .then((data) => {
        setAssignments(data.assignments || []);
      })
      .catch((error) => {
        console.error('Error fetching assignments:', error);
      });
  }, [subject]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/account`, {
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('Nie udało się pobrać danych użytkownika');
      return res.json();
    }).then((json) => {
      setUserId(json.user_id);
    });
    fetchRoles(user_id);
  }, [user_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentId || !zipFile) {
      alert('Proszę wybrać ćwiczenie i załączyć plik ZIP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      const payload = {
        solution: {
          solution_data: Array.from(uint8Array),
          student_comment: studentComment,
          exercise_date: excerciseDate + "T00:00:00",
          mime_type: 'application/zip'
        },
        coauthors_user_ids: selectedCoAuthors,
        teacher_id: teacher.user_id,
      };
      try {
        console.log('Sending payload:', payload);
        const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}/solution`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          alert('Sprawozdanie zostało przesłane pomyślnie.');
          router.push('/userMain');
        } else {
          const err = await response.text();
          console.error('Error during upload:', err);
          alert('Błąd podczas przesyłania');
        }
      } catch (error) {
        console.error('Error during upload:', error);
        alert('Wystąpił błąd podczas przesyłania sprawozdania.');
      }
    };

    reader.readAsArrayBuffer(zipFile);
  };

  const fetchRoles = (user_id?: string) => {
    if (user_id !== undefined) {
      fetch(`http://localhost:8000/api/users/${user_id}/roles`, {
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) throw new Error('Nie udało się pobrać ról użytkownika ' + user_id);
        return res.json();
      }).then((json) => {
        setRoles(json.roles);
        if (json.roles.length > 0) {
          setSelectedRole(json.roles[0].role_id); // Set default role to the first one
          fetchStudents(json.roles[0].role_id); // Fetch students for the default role
        }
      });
    }
  }

  const fetchStudents = async (e: string) => {

    setSelectedRole(e);
    try {
      const res = await fetch(`http://localhost:8000/api/roles/${e}/users`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Nie udało się pobrać uczniów');

      const json: User[] = await res.json();
      setStudents(json);
    } catch (err) {
      console.error('Błąd podczas pobierania uczniów:', err);
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = e.target.value;
    setSelectedCoAuthors((prev) =>
      e.target.checked ? [...prev, userId] : prev.filter((id) => id !== userId));
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h1 style={{ color: '#000000', fontSize: 30 }}>Sprawozdanie</h1>

      <label className={styles.label}>Ćwiczenie</label>
      <select
        className={styles.select}
        value={assignmentId}
        onChange={(e) => setAssignmentId(e.target.value)}
        required
      >
        <option value="">-- Wybierz ćwiczenie --</option>
        {assignments.map((assignment) => (
          <option key={assignment.assignment_id} value={assignment.assignment_id}>
            {assignment.title}
          </option>
        ))}
      </select>

      <label className={styles.label}>Prowadzący</label>
      <select
        className={styles.select}
        onChange={(e) => {
          const selected = teachers.find(t => t.user_id === e.target.value);
          setTeacher(selected ? selected : { full_name: '', user_id: '' });
        }}
        value={teacher.user_id}
        required
      >
        <option value="">---</option>
        {teachers.map((teacher) => (
          <option key={teacher.user_id} value={teacher.user_id}>
            {teacher.full_name}
          </option>
        ))}
      </select>

      <label className={styles.label}>Data odbycia ćwiczenia</label>
      <input type="date" className={styles.input} onChange={(e) => { setExerciseDate(e.target.value) }} />

      <label className={styles.label}>Podsekcja</label>
      <select
        className={styles.input}
        value={selectedRole}
        onChange={(e) => { fetchStudents(e.target.value); }}
      >
        {roles.length !== 0 &&
          roles.map((role) => (
            <option key={role.role_id} value={role.role_id}>
              {role.role_id + " " + role.name}
            </option>
          ))
        }
      </select>

      <label className={styles.label}>Skład:</label>
      <div className={styles.checkboxGroup}>
        {students.map((student) => (
          <label key={student.user_id}>
            <input type="checkbox" value={student.user_id} onChange={handleCheckboxChange} />
            {student.full_name} ({student.student_id})
          </label>
        ))}
      </div>

      <label className={styles.label}>Uwagi:</label>
      <textarea rows={4} className={styles.textarea} onChange={(e) => { setStudentComment(e.target.value) }} />

      <label className={styles.label}>Plik ZIP:</label>
      <input
        type="file"
        accept="application/zip"
        className={styles.input}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setZipFile(e.target.files[0]);
          }
        }}
        required
      />

      <button type="submit" className={styles.button}>
        Wyślij
      </button>
    </form>
  )
}
