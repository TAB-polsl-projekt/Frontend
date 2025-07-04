import { useState, useEffect } from 'react';
import userStyles from '@/styles/userPage.module.css';
import Modal from '@/components/ui/Modals/Generic';
import { getSubjectInStorage, setSubjectInStorage } from '@/utils/subjectStorage';
interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description: string;
  attendance: boolean;
}

interface AssignmentsData {
  subject_name: string;
  assignments: Assignment[];
  solutions: Solution[];
}
interface Solution {
  solution_id: string;
  grade: number;
  submission_date: string;
  reviewed_by: string;
  review_comment: string;
  review_date: string;
  assignment_id: string;
}

export default function AssignmentsTable() {
  const [errorString, setErrorString] = useState<string | null>("Loading...");

  const [data, setData] = useState<AssignmentsData | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionExistsMap, setSolutionExistsMap] = useState<Record<string, boolean>>({});
  const [solutionGradeMap, setSolutionGradeMap] = useState<Record<string, number>>({});
  const [solutionRedoGradeMap, setSolutionRedoGradeMap] = useState<Record<string, number>>({});
  const [assignmentGradeMap, setAssignmentGradeMap] = useState<Record<string, number>>({});

  const [subject, setSubject] = useState<{ subject_id: string; subject_name: string } | null>(null);

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
    if (subject?.subject_id && data) {
      return; // Already set—do nothing
    }

    async function initSubject() {
      try {
        const res = await fetch('http://localhost:8000/api/subjects', {
          credentials: 'include'
        });
        if (res.status === 401) {
          alert("Nie masz uprawnień. Zaloguj się ponownie.");
          window.location.href = '/';
        } else if (res.status === 500) {
          alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
          console.error('Server error while fetching subjects in /userMain');
          return;
        } else if (res.status === 404) {
          setErrorString("Nie jesteś zapisany do żadnego przedmiotu. Skontaktuj się z administratorem.");
          console.error('No subjects found in /userMain');
          return;
        } else if (!res.ok) {
          throw new Error('Undefined error while fetching subjects in /userMain');
        }

        const list: { subject_id: string; subject_name: string }[] = await res.json();
        let chosen = list[0];

        setSubjectInStorage(chosen);
        setData;
      } catch (err) {
        console.error(err);
      }
    }
    if (getSubjectInStorage()) {
      setSubject(getSubjectInStorage());
    }
    else {
      initSubject();
    }
  }, []);

  useEffect(() => {
    if (!subject?.subject_id) return;
    fetch('http://localhost:8000/api/subjects/' + subject?.subject_id, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Nie masz uprawnień. Zaloguj się ponownie.");
          window.location.href = '/';
        } else if (res.status === 500) {
          alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
          console.error('Server error while fetching subject data in /userMain');
          return;
        } else if (!res.ok) {
          throw new Error('Undefined error while fetching subject data in /userMain');
        }
        return res.json()
      }).then((json) => {
        setData(json);
      });
  }, [subject]);

  useEffect(() => {
    if (!data?.assignments) return;

    const fetchSolutions = async () => {
      const results: Record<string, boolean> = {};
      for (const assignment of data.assignments) {
        try {
          const res = await fetch(`http://localhost:8000/api/assignments/${assignment.assignment_id}/solution`, {
            method: 'GET',
            credentials: 'include',
          });
          results[assignment.assignment_id] = res.ok;

          if (res.status === 401) {
            alert("Nie masz uprawnień. Zaloguj się ponownie.");
            window.location.href = '/';
          } else if (res.status === 500) {
            //alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
            console.error(`Server error while fetching solution for assignment ${assignment.assignment_id} in /userMain`);
            console.log('---Either there is no solution, or server is down---');
            continue;
          } else if (res.status === 404) {
            console.log(`No solution found for assignment ${assignment.assignment_id}`);
            continue; // No solution exists for this assignment
          } else if (!res.ok) {
            console.error(`Undefined error while fetching solution for assignment ${assignment.assignment_id} in /userMain`);
            return;
          }
          const json: Solution = await res.json();
          setSolutionGradeMap(prev => ({ ...prev, [assignment.assignment_id]: json.grade }));
        } catch (e) {
          results[assignment.assignment_id] = false;
          console.error(`Error fetching solution for assignment ${assignment.assignment_id}:`, e);
        }
      }
      setSolutionExistsMap(results);
    };

    fetchSolutions();
  }, [data]);

  useEffect(() => {
    const newMap: Record<string, number> = {};
    for (const assignment of data?.assignments || []) {
      if (solutionExistsMap[assignment.assignment_id]) {
        const grade = solutionGradeMap[assignment.assignment_id];
        newMap[assignment.assignment_id] = grade ?? 0;
      } else {
        newMap[assignment.assignment_id] = NaN;
      }
    }
    setAssignmentGradeMap(newMap);
  }, [data, solutionExistsMap, solutionGradeMap]);

  const handleExerciseClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubjectModalOpen(true);
  };

  const handleReportClick = async (assignment: Assignment) => {
    try {
      const res = await fetch(`http://localhost:8000/api/assignments/${assignment.assignment_id}/solution`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.status === 401) {
        alert("Nie masz uprawnień. Zaloguj się ponownie.");
        window.location.href = '/';
      } else if (res.status === 500) {
        alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
        console.error(`Server error while fetching solution for assignment ${assignment.assignment_id} in /userMain`);
      } else if (!res.ok) {
        console.error(`Undefined error while fetching solution for assignment ${assignment.assignment_id} in /userMain`);
        return;
      }
      const json: Solution = await res.json();
      setSelectedAssignment(assignment);
      setSelectedSolution(json);
      setIsSolutionModalOpen(true);
    } catch (err) {
      console.error("Error fetching solution:", err);
    }

  };

  if (!data) return <p>{errorString}</p>;

  return (
    <div className={userStyles.dashboard}>
      <h1 className={userStyles.title}>
        Twoje Ćwiczenia z przedmiotu: {
          (() => {
            const subj = getSubjectInStorage();
            if (subj) {
              try {
                return subj.subject_name;
              } catch {
                return '';
              }
            }
            return '';
          })()
        }
      </h1>
      <table className={userStyles.table}>
        <thead>
          <tr>
            <th>Ćwiczenie</th>
            <th>Termin 1</th>
            <th>Obecność</th>
            <th>Sprawozdanie</th>
            <th>Ocena</th>
          </tr>
        </thead>
        <tbody>
          {data.assignments.map((assignment) => (
            <tr key={assignment.assignment_id}>
              <td>
                <button className={userStyles.linkButton} onClick={() => handleExerciseClick(assignment)}>
                  {assignment.title}
                </button>
              </td>
              <td>{solutionGradeMap[assignment.assignment_id]}</td>
              <td>{assignment.attendance}</td>
              <td>
                {(() => {
                  const grade = solutionGradeMap[assignment.assignment_id];
                  if (isNaN(grade)) {
                    return <span>Brak</span>;
                  } else if (grade === 2) {
                    return <button className={userStyles.linkButton} onClick={() => handleReportClick(assignment)}>Zwrot</button>;
                  } else if (grade === undefined || grade === null) {
                    return <span>Wysłane</span>;
                  } else {
                    return <button className={userStyles.linkButton} onClick={() => handleReportClick(assignment)}>Zobacz Sprawozdanie</button>;
                  }
                })()}
              </td>
              <td>{
                assignmentGradeMap[assignment.assignment_id] !== undefined && assignmentGradeMap[assignment.assignment_id] !== null && !isNaN(assignmentGradeMap[assignment.assignment_id])
                  ? assignmentGradeMap[assignment.assignment_id]
                  : <span>Brak oceny</span>
              }
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className={userStyles.footer} style={{ border: 'none', backgroundColor: '#ffffff' }}>
              <p></p>
            </td>
            <td>
              {
                (() => {
                  const grades = Object.values(assignmentGradeMap).filter(
                    grade => grade !== undefined && grade !== null && !isNaN(grade) && grade !== 0
                  );
                  return grades.length > 0
                    ? (grades.reduce((acc, grade) => acc + grade, 0) / grades.length).toFixed(2)
                    : <span>Brak ocen</span>;
                })()
              }
            </td>
          </tr>
        </tbody>
      </table>
      {isSubjectModalOpen && selectedAssignment && (
        <Modal onClose={() => setIsSubjectModalOpen(false)}>
          <h2>{selectedAssignment.title}</h2>
          <p>{selectedAssignment.description}</p>
        </Modal>
      )}
      {isSolutionModalOpen && selectedSolution && selectedAssignment && (
        <Modal onClose={() => setIsSolutionModalOpen(false)}>
          <h2>{selectedAssignment.title}</h2>
          <p>{selectedSolution.review_comment}</p>
        </Modal>
      )}
    </div>
  );
}