import { useState, useEffect } from 'react';
import userStyles from '@/styles/userPage.module.css';
import Modal from '@/components/ui/Modals/Generic';
import { useSubject } from '@/context/SubjectContext';

interface Assignment {
  assignment_id: string;
  subject_id: string;
  title: string;
  description: string;
}

interface AssignmentsData {
  subject_name: string;
  assignments: Assignment[];
}

export default function AssignmentsTable() {
  const [data, setData] = useState<AssignmentsData | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const {subject} = useSubject();

  useEffect(() => {
    fetch('/JSON_API_Endpoint_Data/api-subjects-id.json')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const handleExerciseClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubjectModalOpen(true);
  };

  const handleReportClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubjectModalOpen(true);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className={userStyles.dashboard}>
      <h1 className={userStyles.title}>Twoje Ćwiczenia z przedmiotu: {subject.subject_name}</h1>
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
              <td>3.0</td>
              <td></td>
              <td>Obecny</td>
              <td>
                <button className={userStyles.linkButton} onClick={() => handleReportClick(assignment)}>
                  Zaliczone
                </button>
              </td>
              <td>3.0</td>
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
    </div>
  );
}