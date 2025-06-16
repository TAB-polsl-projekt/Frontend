// src/app/(user)/userPage/page.tsx
'use client';

import React, { useState } from 'react';
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
  solution_data?: string;
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
  const [a, setA] = useState({
    "a": 1,
    "b": 2,
    "c": 3
  });

  const [isModalOpen, setIsModalOpen] = useState(true);
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

  // Lista wszystkich studentów
  const [students] = useState<User[]>([
    { user_id: '1', email: 'jan.kowalski@example.com', name: 'Jan', surname: 'Kowalski', student_id: '123456', user_disabled: false, is_admin: false },
    { user_id: '2', email: 'anna.nowak@example.com', name: 'Anna', surname: 'Nowak', student_id: '123457', user_disabled: false, is_admin: false },
    { user_id: '3', email: 'piotr.wisniewski@example.com', name: 'Piotr', surname: 'Wiśniewski', student_id: '123458', user_disabled: false, is_admin: false },
    { user_id: '4', email: 'maria.wójcik@example.com', name: 'Maria', surname: 'Wójcik', student_id: '123459', user_disabled: false, is_admin: false },
    { user_id: '5', email: 'adam.lewandowski@example.com', name: 'Adam', surname: 'Lewandowski', student_id: '123460', user_disabled: false, is_admin: false }
  ]);

  // Mapowanie przedmiotów do studentów
  const [subjectStudents, setSubjectStudents] = useState<Record<string, string[]>>({
    '1': ['1', '2', '3'], // Automaty cyfrowe
    '2': ['2', '4', '5'], // Programowanie obiektowe
  });

  const [subjects, setSubjects] = useState<Subject[]>([
    { subject_id: '1', subject_name: 'Automaty cyfrowe', editor_role_id: '1' },
    { subject_id: '2', subject_name: 'Programowanie obiektowe', editor_role_id: '2' },
  ]);

  const [subjectsData, setSubjectsData] = useState<Record<string, SubjectData>>({
    '1': {
      assignments: [
        { assignment_id: '1', subject_id: '1', title: 'Ćwiczenie 1: Kombinacyjne automaty cyfrowe', description: 'Projektowanie i implementacja układów kombinacyjnych' },
        { assignment_id: '2', subject_id: '1', title: 'Ćwiczenie 2: Elementarne automaty sekwencyjne', description: 'Analiza i projektowanie automatów sekwencyjnych' }
      ],
      studentAssignments: {
        '1': [
          { assignmentId: '1', term1: '3.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '3.0' },
          { assignmentId: '2', term1: '2.0', poprawa: '3.5', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '2.75' }
        ],
        '2': [
          { assignmentId: '1', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' },
          { assignmentId: '2', term1: '5.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '5.0' }
        ],
        '3': [
          { assignmentId: '1', term1: '3.5', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '3.5' },
          { assignmentId: '2', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' }
        ]
      },
      solutions: {
        '1': [
          { 
            solution_id: '1',
            user_id: '1',
            grade: 3.0,
            submission_date: new Date(),
            review_comment: 'Dobra praca',
            review_date: new Date(),
            solution_data: "Moje super sprawozdanie."
          },
          {
            solution_id: '2',
            user_id: '1',
            grade: 2.75,
            submission_date: new Date(),
            review_comment: 'Wymaga poprawy',
            review_date: new Date(),
            solution_data: "Moje super sprawozdanie."
          }
        ],
        '2': [
          {
            solution_id: '3',
            user_id: '2',
            grade: 4.0,
            submission_date: new Date(),
            review_comment: 'Bardzo dobra praca',
            review_date: new Date(),
            solution_data: "Moje super sprawozdanie."
          },
          {
            solution_id: '4',
            user_id: '2',
            grade: 5.0,
            submission_date: new Date(),
            review_comment: 'Wzorowa praca',
            review_date: new Date(),
            solution_data: "Moje super sprawozdanie."
          }
        ]
      }
    },
    '2': {
      assignments: [
        { assignment_id: '1', subject_id: '2', title: 'Laboratorium 1: Wprowadzenie do Javy', description: 'Podstawy programowania w Javie' },
        { assignment_id: '2', subject_id: '2', title: 'Laboratorium 2: Klasy i obiekty', description: 'Programowanie obiektowe w Javie' },
        { assignment_id: '3', subject_id: '2', title: 'Laboratorium 3: Dziedziczenie i polimorfizm', description: 'Zaawansowane koncepcje OOP' }
      ],
      studentAssignments: {
        '2': [
          { assignmentId: '1', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' },
          { assignmentId: '2', term1: '5.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '5.0' },
          { assignmentId: '3', term1: '4.5', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.5' }
        ],
        '4': [
          { assignmentId: '1', term1: '3.5', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '3.5' },
          { assignmentId: '2', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' },
          { assignmentId: '3', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' }
        ],
        '5': [
          { assignmentId: '1', term1: '4.5', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.5' },
          { assignmentId: '2', term1: '4.0', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.0' },
          { assignmentId: '3', term1: '4.5', poprawa: '', obecnosc: 'Obecny', sprawozdanie: 'Zaliczone', ocena: '4.5' }
        ]
    },
      solutions: {
        '2': [
          {
            solution_id: '5',
            user_id: '2',
            grade: 4.0,
            submission_date: new Date(),
            review_comment: 'Dobra implementacja',
            review_date: new Date()
          },
          {
            solution_id: '6',
            user_id: '2',
            grade: 5.0,
            submission_date: new Date(),
            review_comment: 'Wzorowa implementacja',
            review_date: new Date()
          },
          {
            solution_id: '7',
            user_id: '2',
            grade: 4.5,
            submission_date: new Date(),
            review_comment: 'Bardzo dobra implementacja',
            review_date: new Date()
          }
        ]
      }
    }
  });

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
};

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setSelectedStudent(null);
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      const newId = (Math.max(...subjects.map(s => parseInt(s.subject_id))) + 1).toString();
      const newSubject: Subject = { 
        subject_id: newId, 
        subject_name: newSubjectName.trim(),
        editor_role_id: '0' // Domyślna rola edytora
      };

      setSubjects([...subjects, newSubject]);
      setSubjectsData({
        ...subjectsData,
        [newId]: {
          assignments: [],
          studentAssignments: {},
          solutions: {}
        }
      });
      setNewSubjectName('');
      setIsAddSubjectModalOpen(false);
    }
  };

  const handleDeleteSubject = () => {
    if (selectedSubject) {
      setSubjects(subjects.filter(s => s.subject_id !== selectedSubject));
      const newSubjectsData = { ...subjectsData };
      delete newSubjectsData[selectedSubject];
      setSubjectsData(newSubjectsData);
      setSelectedSubject('');
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const handleAddStudentToSubject = (studentId: string) => {
    if (selectedSubject && !subjectStudents[selectedSubject]?.includes(studentId)) {
      setSubjectStudents({
        ...subjectStudents,
        [selectedSubject]: [...(subjectStudents[selectedSubject] || []), studentId]
      });

      // Initialize empty assignment data for the new student
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        setSubjectsData({
          ...subjectsData,
          [selectedSubject]: {
            ...subjectData,
            studentAssignments: {
              ...subjectData.studentAssignments,
              [studentId]: subjectData.assignments.map(ex => ({
                assignmentId: ex.assignment_id,
                term1: '',
                poprawa: '',
                obecnosc: 'Nieobecny',
                sprawozdanie: 'Niezaliczone',
                ocena: ''
              }))
            },
            solutions: {
              ...subjectData.solutions,
              [studentId]: subjectData.assignments.map(ex => ({
                solution_id: Date.now().toString(),
                user_id: studentId,
                grade: undefined,
                submission_date: new Date(),
                review_comment: '',
                review_date: undefined
              }))
            }
          }
        });
      }
    }
  };

  const handleRemoveStudentFromSubject = (studentId: string) => {
    if (selectedSubject) {
      setSubjectStudents({
        ...subjectStudents,
        [selectedSubject]: subjectStudents[selectedSubject].filter(id => id !== studentId)
      });

      // Remove student's assignment data and solutions
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        const { [studentId]: removedAssignments, ...remainingStudentAssignments } = subjectData.studentAssignments;
        const { [studentId]: removedSolutions, ...remainingSolutions } = subjectData.solutions;
        
        setSubjectsData({
          ...subjectsData,
          [selectedSubject]: {
            ...subjectData,
            studentAssignments: remainingStudentAssignments,
            solutions: remainingSolutions
          }
        });
      }
    }
  };

  const handleAddAssignment = () => {
    if (newAssignment.title.trim() && selectedSubject) {
      const assignmentId = Date.now().toString();
      const newAssignmentWithId = { ...newAssignment, assignment_id: assignmentId };
      
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        // Add assignment to subject
        const updatedAssignments = [...subjectData.assignments, newAssignmentWithId];
        
        // Add empty assignment data for all students
        const updatedStudentAssignments = { ...subjectData.studentAssignments };
        const updatedSolutions = { ...subjectData.solutions };
        
        Object.keys(updatedStudentAssignments).forEach(studentId => {
          updatedStudentAssignments[studentId] = [
            ...updatedStudentAssignments[studentId],
            {
              assignmentId,
              term1: '',
              poprawa: '',
              obecnosc: 'Nieobecny',
              sprawozdanie: 'Niezaliczone',
              ocena: ''
            }
          ];
          
          updatedSolutions[studentId] = [
            ...(updatedSolutions[studentId] || []),
            {
              solution_id: Date.now().toString(),
              user_id: studentId,
              grade: undefined,
              submission_date: new Date(),
              review_comment: '',
              review_date: undefined
            }
          ];
        });

        setSubjectsData({
          ...subjectsData,
          [selectedSubject]: {
            assignments: updatedAssignments,
            studentAssignments: updatedStudentAssignments,
            solutions: updatedSolutions
          }
        });
      }

      setNewAssignment({ assignment_id: '', subject_id: '', title: '', description: '' });
      setIsAddAssignmentModalOpen(false);
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (selectedSubject) {
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        // Remove assignment from subject
        const updatedAssignments = subjectData.assignments.filter(ex => ex.assignment_id !== assignmentId);
        
        // Remove assignment data from all students
        const updatedStudentAssignments = { ...subjectData.studentAssignments };
        const updatedSolutions = { ...subjectData.solutions };
        
        Object.keys(updatedStudentAssignments).forEach(studentId => {
          updatedStudentAssignments[studentId] = updatedStudentAssignments[studentId]
            .filter(ex => ex.assignmentId !== assignmentId);
          
          updatedSolutions[studentId] = updatedSolutions[studentId]
            .filter(s => s.solution_id !== assignmentId);
        });

        setSubjectsData({
          ...subjectsData,
          [selectedSubject]: {
            assignments: updatedAssignments,
            studentAssignments: updatedStudentAssignments,
            solutions: updatedSolutions
          }
        });
      }
    }
  };

  const handleUpdateStudentAssignment = (studentId: string, assignmentId: string, field: keyof StudentAssignment, value: string) => {
    if (selectedSubject) {
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        const updatedStudentAssignments = { ...subjectData.studentAssignments };
        const studentAssignments = updatedStudentAssignments[studentId];
        const assignmentIndex = studentAssignments.findIndex(ex => ex.assignmentId === assignmentId);
        
        if (assignmentIndex !== -1) {
          // Validate grade input
          if (field === 'term1' || field === 'poprawa' || field === 'ocena') {
            const numValue = parseFloat(value);
            if (value && (isNaN(numValue) || numValue < 2 || numValue > 5)) {
              return; // Don't update if invalid grade
            }
          }
          
          studentAssignments[assignmentIndex] = {
            ...studentAssignments[assignmentIndex],
            [field]: value
          };
          
          setSubjectsData({
            ...subjectsData,
            [selectedSubject]: {
              ...subjectData,
              studentAssignments: updatedStudentAssignments
            }
          });
        }
      }
    }
  };

  const handleViewReport = (studentId: string, assignmentId: string) => {
    if (selectedSubject) {
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        const solution = subjectData.solutions[studentId]?.find(
          s => s.solution_id === assignmentId
        );
        if (solution) {
          setSelectedReport(solution);
          setIsReportModalOpen(true);
        } else {
          alert('Nie znaleziono sprawozdania dla tego zadania.');
        }
      }
    }
  };

  const handleUpdateReport = (field: keyof Solution, value: string | number | Date) => {
    if (selectedSubject && selectedStudent && selectedReport) {
      const subjectData = subjectsData[selectedSubject];
      if (subjectData) {
        const updatedSolutions = { ...subjectData.solutions };
        const studentSolutions = updatedSolutions[selectedStudent];
        const solutionIndex = studentSolutions.findIndex(
          s => s.solution_id === selectedReport.solution_id
        );
        
        if (solutionIndex !== -1) {
          studentSolutions[solutionIndex] = {
            ...studentSolutions[solutionIndex],
            [field]: value
          };
          
          setSubjectsData({
            ...subjectsData,
            [selectedSubject]: {
              ...subjectData,
              solutions: updatedSolutions
            }
          });
          
          setSelectedReport(studentSolutions[solutionIndex]);
        }
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}></h1>
      
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
                <h3>Treść sprawozdania:</h3>
                <button
                    className={styles.addButton}
                    onClick={() => {
                      const blob = new Blob([selectedReport.solution_data!], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `sprawozdanie_${selectedStudent}_${selectedReport.solution_id}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }}>Pobierz sprawozdanie</button>
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
