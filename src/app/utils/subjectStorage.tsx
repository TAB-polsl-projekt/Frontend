// utils/subjectStorage.ts
export function setSubjectInStorage(subject: { subject_id: string; subject_name: string }) {
  localStorage.setItem('subject', JSON.stringify(subject));
  window.dispatchEvent(new Event('subjectChanged'));
}

export function getSubjectInStorage(): { subject_id: string; subject_name: string } | null {
  const subject = localStorage.getItem('subject');
  return subject ? JSON.parse(subject) : null;
}
