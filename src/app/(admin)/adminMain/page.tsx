// src/app/(user)/userPage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/adminPage.module.css';
import Modal from '@/components/ui/Modals/Generic';

// Backend models
interface User {
  user_id: string;
  email: string;
  name: string;
  surname: string;
  student_id?: string;
  user_disabled: boolean;
  last_login_time?: Date;
  is_admin: boolean;
}

interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description?: string;
  accepted_mime_types?: string;
}

interface Subject {
  subject_id: string;
  subject_name?: string;
  editor_role_id: string;
}

interface Solution {
  solution_id: string;
  user_id: string;
  grade?: number;
  submission_date?: Date;
  solution_data?: Uint8Array;
  reviewed_by?: string;
  review_comment?: string;
  review_date?: Date;
  mime_type?: string;
}

// Frontend specific types (not from backend)
interface StudentAssignment {
  assignmentId: string;
  term1: string;
  poprawa: string;
  obecnosc: string;
  sprawozdanie: string;
  ocena: string;
}

interface SubjectData {
  assignments: Assignment[];
  studentAssignments: Record<string, StudentAssignment[]>;
  solutions: Record<string, Solution[]>;
}

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Solution | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newAssignment, setNewAssignment] = useState<Assignment>({
    assignment_id: '',
    subject_id: '',
    title: '',
    description: ''
  });

  // State for API data
  const [students, setStudents] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsData, setSubjectsData] = useState<Record<string, SubjectData>>({});
  const [subjectStudents, setSubjectStudents] = useState<Record<string, string[]>>({});

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch subjects
        const subjectsResponse = await fetch('http://localhost:8000/api/subjects', {
          credentials: 'include'
        });
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);

        // Fetch all users
        alert('Endpoint niezaimplementowany: GET /users');
        const usersResponse = await fetch('http://localhost:8000/api/users', {
          credentials: 'include'
        });
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setStudents(usersData);

      } catch (error) {
        console.error('Error fetching initial data:', error);
        alert('Błąd komunikacji z API');
      }
    };

    fetchInitialData();
  }, []);

  // Fetch subject data when selected
  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!selectedSubject) return;

      try {
        const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch subject data');
        const data = await response.json();
        
        // Transform API data to match our frontend structure
        const subjectData: SubjectData = {
          assignments: data.assignments,
          studentAssignments: {}, // Will be populated from API
          solutions: {} // Will be populated from API
        };

        // Fetch student assignments
        alert('Endpoint niezaimplementowany: GET /subjects/{id}/student-assignments');
        const studentAssignmentsResponse = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}/student-assignments`, {
          credentials: 'include'
        });
        if (studentAssignmentsResponse.ok) {
          const studentAssignmentsData = await studentAssignmentsResponse.json();
          subjectData.studentAssignments = studentAssignmentsData;
        }

        // Fetch solutions
        alert('Endpoint niezaimplementowany: GET /subjects/{id}/solutions');
        const solutionsResponse = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}/solutions`, {
          credentials: 'include'
        });
        if (solutionsResponse.ok) {
          const solutionsData = await solutionsResponse.json();
          subjectData.solutions = solutionsData;
        }
        
        setSubjectsData(prev => ({
          ...prev,
          [selectedSubject]: subjectData
        }));

      } catch (error) {
        console.error('Error fetching subject data:', error);
        alert('Błąd komunikacji z API');
      }
    };

    fetchSubjectData();
  }, [selectedSubject]);

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setSelectedStudent(null);
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      try {
        alert('Endpoint niezaimplementowany: POST /subjects');
        const response = await fetch('http://localhost:8000/api/subjects', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_name: newSubjectName
          })
        });

        if (!response.ok) throw new Error('Failed to add subject');

        window.location.reload();
      } catch (error) {
        console.error('Error adding subject:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleDeleteSubject = async () => {
    if (selectedSubject) {
      try {
        alert('Endpoint niezaimplementowany: DELETE /subjects/{id}');
        const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to delete subject');

        window.location.reload();
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const handleAddStudentToSubject = async (studentId: string) => {
    if (selectedSubject && !subjectStudents[selectedSubject]?.includes(studentId)) {
      try {
        alert('Endpoint niezaimplementowany: POST /subjects/{id}/students');
        const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}/students`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: studentId
          })
        });

        if (!response.ok) throw new Error('Failed to add student to subject');

        window.location.reload();
      } catch (error) {
        console.error('Error adding student to subject:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleRemoveStudentFromSubject = async (studentId: string) => {
    if (selectedSubject) {
      try {
        alert('Endpoint niezaimplementowany: DELETE /subjects/{id}/students/{studentId}');
        const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}/students/${studentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to remove student from subject');

        window.location.reload();
      } catch (error) {
        console.error('Error removing student from subject:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleAddAssignment = async () => {
    if (newAssignment.title.trim() && selectedSubject) {
      try {
        // Generate a unique assignment_id using timestamp and random string
        const assignment_id = crypto.randomUUID();
        
        const response = await fetch('http://localhost:8000/api/assignments', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newAssignment,
            assignment_id,
            subject_id: selectedSubject
          })
        });

        if (!response.ok) throw new Error('Failed to add assignment');

        window.location.reload();
      } catch (error) {
        console.error('Error adding assignment:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (selectedSubject) {
      try {
        alert('Endpoint niezaimplementowany: DELETE /assignments/{id}');
        const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to delete assignment');

        window.location.reload();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleUpdateStudentAssignment = async (studentId: string, assignmentId: string, field: keyof StudentAssignment, value: string) => {
    if (selectedSubject) {
      try {
        alert('Endpoint niezaimplementowany: PUT /subjects/{id}/students/{studentId}/assignments/{assignmentId}');
        const response = await fetch(`http://localhost:8000/api/subjects/${selectedSubject}/students/${studentId}/assignments/${assignmentId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [field]: value
          })
        });

        if (!response.ok) throw new Error('Failed to update student assignment');

        window.location.reload();
      } catch (error) {
        console.error('Error updating student assignment:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleViewReport = async (studentId: string, assignmentId: string) => {
    if (selectedSubject) {
      try {
        const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}/students/${studentId}/solution`, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch solution');
        
        const solution = await response.json();
        setSelectedReport(solution);
        setIsReportModalOpen(true);
      } catch (error) {
        console.error('Error fetching solution:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  const handleUpdateReport = async (field: keyof Solution, value: string | number | Date) => {
    if (selectedSubject && selectedStudent && selectedReport) {
      try {
        alert('Endpoint niezaimplementowany: PUT /assignments/{id}/students/{studentId}/solution');
        const response = await fetch(`http://localhost:8000/api/assignments/${selectedReport.solution_id}/students/${selectedStudent}/solution`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [field]: value
          })
        });

        if (!response.ok) throw new Error('Failed to update report');

        window.location.reload();
      } catch (error) {
        console.error('Error updating report:', error);
        alert('Błąd komunikacji z API');
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>ADMIN PAGE --- TODO</h1>
      
      <div className={styles.subjectSelector}>
        <label htmlFor="subjectSelect">Wybierz przedmiot:</label>
        <select 
          id="subjectSelect"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className={styles.select}
        >
          <option value="">-- Wybierz przedmiot --</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
        <button 
          className={styles.addButton}
          onClick={() => setIsAddSubjectModalOpen(true)}
        >
          Dodaj przedmiot
        </button>
        <button 
          className={styles.deleteButton}
          onClick={handleDeleteSubject}
          disabled={!selectedSubject}
        >
          Usuń przedmiot
        </button>
        <button 
          className={styles.addButton}
          onClick={() => setIsAddAssignmentModalOpen(true)}
          disabled={!selectedSubject}
        >
          Dodaj zadanie
        </button>
      </div>

      {selectedSubject && (
        <div className={styles.studentManagement}>
          <div className={styles.studentSelector}>
            <h3>Zarządzanie studentami</h3>
            <div className={styles.studentControls}>
              <select 
                className={styles.select}
                onChange={(e) => handleAddStudentToSubject(e.target.value)}
                value=""
              >
                <option value="">-- Dodaj studenta --</option>
                {students
                  .filter(student => !subjectStudents[selectedSubject]?.includes(student.user_id))
                  .map(student => (
                    <option key={student.user_id} value={student.user_id}>
                      {student.name} {student.surname} ({student.student_id})
                    </option>
                  ))
                }
              </select>
            </div>
            <div className={styles.studentList}>
              <h4>Lista studentów na przedmiocie:</h4>
              <ul>
                {subjectStudents[selectedSubject]?.map(studentId => {
                  const student = students.find(s => s.user_id === studentId);
                  return student ? (
                    <li key={student.user_id} className={styles.studentItem}>
                      <button 
                        className={styles.studentButton}
                        onClick={() => handleStudentSelect(student.user_id)}
                      >
                        {student.name} {student.surname} ({student.student_id})
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleRemoveStudentFromSubject(student.user_id)}
                      >
                        Usuń
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {selectedSubject && selectedStudent && (
        <div className={styles.studentGrades}>
          <h3>Oceny studenta: {students.find(s => s.user_id === selectedStudent)?.name} {students.find(s => s.user_id === selectedStudent)?.surname}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
                <th>Zadanie</th>
            <th>Termin 1</th>
            <th>Poprawa</th>
            <th>Obecność</th>
            <th>Sprawozdanie</th>
            <th>Ocena</th>
                <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
              {subjectsData[selectedSubject]?.assignments.map((assignment) => {
                const studentAssignment = subjectsData[selectedSubject]?.studentAssignments[selectedStudent]?.find(
                  ex => ex.assignmentId === assignment.assignment_id
                );
                return (
                  <tr key={assignment.assignment_id}>
                    <td>
                      <button className={styles.linkButton} onClick={() => handleAssignmentClick(assignment)}>
                        {assignment.title}
              </button>
            </td>
                    <td>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        step="0.5"
                        value={studentAssignment?.term1 || ''}
                        onChange={(e) => handleUpdateStudentAssignment(selectedStudent, assignment.assignment_id, 'term1', e.target.value)}
                        className={styles.gradeInput}
                      />
            </td>
                    <td>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        step="0.5"
                        value={studentAssignment?.poprawa || ''}
                        onChange={(e) => handleUpdateStudentAssignment(selectedStudent, assignment.assignment_id, 'poprawa', e.target.value)}
                        className={styles.gradeInput}
                      />
            </td>
                    <td>
                      <select
                        value={studentAssignment?.obecnosc || 'Nieobecny'}
                        onChange={(e) => handleUpdateStudentAssignment(selectedStudent, assignment.assignment_id, 'obecnosc', e.target.value)}
                        className={styles.select}
                      >
                        <option value="Obecny">Obecny</option>
                        <option value="Nieobecny">Nieobecny</option>
                      </select>
            </td>
                    <td>
                      <select
                        value={studentAssignment?.sprawozdanie || 'Niezaliczone'}
                        onChange={(e) => handleUpdateStudentAssignment(selectedStudent, assignment.assignment_id, 'sprawozdanie', e.target.value)}
                        className={styles.select}
                      >
                        <option value="Zaliczone">Zaliczone</option>
                        <option value="Niezaliczone">Niezaliczone</option>
                      </select>
            </td>
                    <td>
                      <input
                        type="number"
                        min="2"
                        max="5"
                        step="0.5"
                        value={studentAssignment?.ocena || ''}
                        onChange={(e) => handleUpdateStudentAssignment(selectedStudent, assignment.assignment_id, 'ocena', e.target.value)}
                        className={styles.gradeInput}
                      />
            </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.viewButton}
                          onClick={() => handleViewReport(selectedStudent, assignment.assignment_id)}
                        >
                          Sprawdź sprawozdanie
              </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteAssignment(assignment.assignment_id)}
                        >
                          Usuń
              </button>
                      </div>
            </td>
          </tr>
                );
              })}
        </tbody>
      </table>
        </div>
      )}

      {isModalOpen && selectedAssignment && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>{selectedAssignment.title}</h2>
          <p>{selectedAssignment.description}</p>
        </Modal>
      )}

      {isAddSubjectModalOpen && (
        <Modal onClose={() => setIsAddSubjectModalOpen(false)}>
          <h2>Dodaj nowy przedmiot</h2>
          <div className={styles.modalContent}>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Nazwa przedmiotu"
              className={styles.input}
            />
            <button 
              className={styles.addButton}
              onClick={handleAddSubject}
              disabled={!newSubjectName.trim()}
            >
              Dodaj
            </button>
          </div>
        </Modal>
      )}

      {isAddAssignmentModalOpen && (
        <Modal onClose={() => setIsAddAssignmentModalOpen(false)}>
          <h2>Dodaj nowe zadanie</h2>
          <div className={styles.modalContent}>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="Nazwa zadania"
              className={styles.input}
            />
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Opis zadania"
              className={styles.textarea}
              rows={4}
            />
            <button 
              className={styles.addButton}
              onClick={handleAddAssignment}
              disabled={!newAssignment.title.trim()}
            >
              Dodaj
            </button>
          </div>
        </Modal>
      )}

      {isReportModalOpen && selectedReport && (
        <Modal onClose={() => setIsReportModalOpen(false)}>
          <div className={styles.reportModal}>
            <h2>Sprawozdanie studenta</h2>
            <div className={styles.reportContent}>
              <div className={styles.reportSection}>
                <h3>Sprawozdanie:</h3>
                {selectedReport.solution_data ? (
                  <button
                    className={styles.downloadButton}
                    onClick={() => {
                      const blob = new Blob([selectedReport.solution_data!], { type: 'application/zip' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `sprawozdanie_${selectedStudent}_${selectedReport.solution_id}.zip`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }}
                  >
                    Pobierz sprawozdanie (ZIP)
                  </button>
                ) : (
                  <div>Brak sprawozdania</div>
                )}
              </div>
              <div className={styles.reportSection}>
                <h3>Komentarz profesora:</h3>
                <textarea
                  value={selectedReport.review_comment || ''}
                  onChange={(e) => handleUpdateReport('review_comment', e.target.value)}
                  className={styles.reportTextarea}
                  rows={4}
                  placeholder="Dodaj komentarz do sprawozdania..."
                />
              </div>
              <div className={styles.reportSection}>
                <h3>Ocena sprawozdania:</h3>
                <input
                  type="text"
                  value={selectedReport.grade || ''}
                  onChange={(e) => handleUpdateReport('grade', parseFloat(e.target.value))}
                  className={styles.gradeInput}
                  placeholder="Ocena"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


// RAW API ENDPOINTS DOCUMENTATION:

// 1. GET /api/subjects
//    Returns: Subject[]
//    interface Subject {
//      subject_id: string;
//      subject_name?: string;
//      editor_role_id: string;
//    }

// 2. GET /api/users
//    Returns: User[]
//    interface User {
//      user_id: string;
//      email: string;
//      name: string;
//      surname: string;
//      student_id?: string;
//      user_disabled: boolean;
//      last_login_time?: Date;
//      is_admin: boolean;
//    }

// 3. GET /api/subjects/{subject_id}
//    Returns: {
//      assignments: Assignment[];
//    }
//    interface Assignment {
//      assignment_id: string;
//      subject_id: string;
//      title: string;
//      description?: string;
//      accepted_mime_types?: string;
//    }

// 4. GET /api/subjects/{subject_id}/student-assignments
//    Returns: Record<string, StudentAssignment[]>
//    interface StudentAssignment {
//      assignmentId: string;
//      term1: string;
//      poprawa: string;
//      obecnosc: string;
//      sprawozdanie: string;
//      ocena: string;
//    }

// 5. GET /api/subjects/{subject_id}/solutions
//    Returns: Record<string, Solution[]>
//    interface Solution {
//      solution_id: string;
//      user_id: string;
//      grade?: number;
//      submission_date?: Date;
//      solution_data?: Uint8Array;
//      reviewed_by?: string;
//      review_comment?: string;
//      review_date?: Date;
//      mime_type?: string;
//    }

// 6. POST /api/subjects
//    Body: {
//      subject_name: string;
//    }
//    Returns: Subject

// 7. DELETE /api/subjects/{subject_id}
//    Returns: void

// 8. POST /api/subjects/{subject_id}/students
//    Body: {
//      student_id: string;
//    }
//    Returns: void

// 9. DELETE /api/subjects/{subject_id}/students/{student_id}
//    Returns: void

// 10. POST /api/assignments
//     Body: {
//       assignment_id: string;
//       subject_id: string;
//       title: string;
//       description?: string;
//       accepted_mime_types?: string;
//     }
//     Returns: Assignment

// 11. DELETE /api/assignments/{assignment_id}
//     Returns: void

// 12. PUT /api/subjects/{subject_id}/students/{student_id}/assignments/{assignment_id}
//     Na pole tzn. szczegółowe pole aktualizuje, nie cały obiekt.
//     Body: {
//       term1?: string;
//       poprawa?: string;
//       obecnosc?: string;
//       sprawozdanie?: string;
//       ocena?: string;
//     }
//     Returns: StudentAssignment

// 13. GET /api/assignments/{assignment_id}/students/{student_id}/solution
//     Returns: Solution

// 14. PUT /api/assignments/{assignment_id}/students/{student_id}/solution
//Na pole tzn. szczegółowe pole aktualizuje, nie cały obiekt.
//     Body: {
//       grade?: number;
//       review_comment?: string;
//     }
//     Returns: Solution
