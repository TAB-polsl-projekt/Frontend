import { useState, useEffect } from 'react';
import userStyles from '@/styles/userPage.module.css';
import Modal from '@/components/ui/Modals/Generic';
import { getSubjectInStorage, setSubjectInStorage } from '@/app/utils/subjectStorage';
interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description: string;
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
  const [data, setData] = useState<AssignmentsData | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionExistsMap, setSolutionExistsMap] = useState<Record<string, boolean>>({});
  const [solutionGradeMap, setSolutionGradeMap] = useState<Record<string, number>>({});
  const [solutionRedoGradeMap, setSolutionRedoGradeMap] = useState<Record<string, number>>({});

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
    if (subject?.subject_id) {
      setData;
      return; // Already set—do nothing
    }

    async function initSubject() {
      try {
        const res = await fetch('http://localhost:8000/api/subjects', {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Could not load subjects');

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
    fetch('http://localhost:8000/api/subjects/' + subject?.subject_id, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => setData(json));
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
          if (res.ok) {
            const json: Solution = await res.json();
            setSolutionGradeMap(prev => ({ ...prev, [assignment.assignment_id]: json.grade }));
          }
        } catch (e) {
          results[assignment.assignment_id] = false;
          console.error(`Error fetching solution for assignment ${assignment.assignment_id}:`, e);
        }
      }
      setSolutionExistsMap(results);
    };

    fetchSolutions();
  }, [data]);

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
      if (!res.ok) throw new Error("Failed to fetch solution");

      const json: Solution = await res.json();
      setSelectedAssignment(assignment);
      setSelectedSolution(json);
      setIsSolutionModalOpen(true);
    } catch (err) {
      console.error("Error fetching solution:", err);
    }

  };

  if (!data) return <p>Loading...</p>;

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
            <th>Poprawa</th>
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
              <td></td>
              <td>Obecny</td>
              <td>
                {solutionExistsMap[assignment.assignment_id] ? (
                  <button className={userStyles.linkButton} onClick={() => handleReportClick(assignment)}>
                    Zobacz sprawozdanie
                  </button>
                ) : (
                  <span>Brak</span>
                )}
              </td>
              <td>{
                solutionRedoGradeMap[assignment.assignment_id] !== undefined
                  ? (solutionRedoGradeMap[assignment.assignment_id] + solutionGradeMap[assignment.assignment_id]) / 2
                  : solutionGradeMap[assignment.assignment_id] || 'Brak oceny'
              }
              </td>
            </tr>
          ))}
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