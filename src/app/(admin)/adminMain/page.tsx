// src/app/(user)/userPage/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/adminPage.module.css";
import Modal from "@/components/ui/Modals/Generic";

type Subject = {
	subject_id: string;
	subject_name: string;
};

type Assignment = {
	assignment_id: string;
	subject_id: string;
	title: string;
	description: string;
	accepted_mime_types: string;
};

type User = {
	user_id: string;
	email: string;
	name: string;
	surname: string;
};

type NewSubjectForm = {
	subject_name: string;
};

type NewAssignmentForm = {
	title: string;
	description: string;
	accepted_mime_types: string;
};

type Solution = {
	solution_id: string;
	assignment_id: string;
	grade?: number;
	submission_date: number;
	solution_data: string;
	review_comment?: string;
	review_date?: string;
	mime_type: string;
};

export default function AdminPage() {
	const baseApiUrl = "http://localhost:8000/api";

	// API State
	const [apiSubjects, setApiSubjects] = useState<Subject[]>([]);
	const [apiSubjectAssignments, setApiSubjectAssignments] = useState<
		Assignment[]
	>([]);

	const [apiSubjectEnrolledUsers, setApiSubjectEnrolledUsers] = useState<
		User[]
	>([]);

	const [apiSubjectNotEnrolledUsers, setApiSubjectNotEnrolledUsers] =
		useState<User[]>([]);

	const [
		apiSubjectUserAssignmentSolution,
		setApiSubjectUserAssignmentSolution,
	] = useState<Solution | null>(null);

	// Frontend State
	const [subject, setSubject] = useState<Subject>();
	const [subjectUser, setSubjectUser] = useState<User | null>(null);

	const [subjectNewAssignment, setSubjectNewAssignment] =
		useState<NewAssignmentForm>({
			title: "",
			description: "",
			accepted_mime_types: "",
		});

	const [newSubject, setNewSubject] = useState<NewSubjectForm>({
		subject_name: "",
	});

	const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] =
		useState<boolean>(false);

	const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] =
		useState<boolean>(false);

	const [isUserSolutionModalOpen, setIsUserSolutionModalOpen] =
		useState<boolean>(false);

	const fetchSubjects = async (): Promise<Subject[]> => {
		const res = await fetch(`${baseApiUrl}/subjects`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			alert("Błąd pobierania przedmiotów");
			return [];
		}

		return await res.json();
	};

	const fetchSubjectAssignments = async (
		subjectId: string
	): Promise<Assignment[]> => {
		const res = await fetch(
			`${baseApiUrl}/subjects/${subjectId}/assignments`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!res.ok) {
			alert("Błąd pobierania ćwiczeń");
			return [];
		}

		return await res.json();
	};

	const fetchSubjectEnrolledUsers = async (
		subjectId: string
	): Promise<User[]> => {
		const res = await fetch(
			`${baseApiUrl}/subjects/${subjectId}/users/enrolled`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!res.ok) {
			alert("Błąd pobierania zapisanych użytkowników");
			return [];
		}

		return await res.json();
	};

	const fetchSubjectNotEnrolledUsers = async (
		subjectId: string
	): Promise<User[]> => {
		const res = await fetch(
			`${baseApiUrl}/subjects/${subjectId}/users/not-enrolled`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!res.ok) {
			alert("Błąd pobierania niezapisanych użytkowników");
			return [];
		}

		return await res.json();
	};

	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedSubject: Subject = JSON.parse(e.target.value);

		setSubject(selectedSubject);
		setSubjectUser(null);
	};

	const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedUser: User = JSON.parse(e.target.value);

		setSubjectUser(selectedUser);
	};

	const addUserToSubject = async () => {
		if (!subject || !subjectUser) return;

		const res = await fetch(
			`${baseApiUrl}/subjects/${subject.subject_id}/users/${subjectUser.user_id}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (res.ok) {
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);
		} else {
			alert("Błąd dodawania użytkownika do przedmiotu");
		}
	};

	const removeUserFromSubject = async () => {
		if (!subject || !subjectUser) return;

		const res = await fetch(
			`${baseApiUrl}/subjects/${subject.subject_id}/users/${subjectUser.user_id}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (res.ok) {
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);

			setSubjectUser(null);
		} else {
			alert("Błąd usuwania użytkownika z przedmiotu");
		}
	};

	const addAssignmentToSubject = async () => {
		if (!subject) return;

		const res = await fetch(
			`${baseApiUrl}/subjects/${subject.subject_id}/assignments`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subjectNewAssignment),
			}
		);

		if (res.ok) {
			fetchSubjectAssignments(subject.subject_id).then((assignments) =>
				setApiSubjectAssignments(assignments)
			);

			setIsAddAssignmentModalOpen(false);

			setSubjectNewAssignment({
				title: "",
				description: "",
				accepted_mime_types: "",
			});
		} else {
			alert("Błąd tworzenia ćwiczenia");
		}
	};

	const handleNewAssignmentChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setSubjectNewAssignment({ ...subjectNewAssignment, [name]: value });
	};

	const deleteAssignmentFromSubject = async (assignmentId: string) => {
		if (!subject) return;

		const res = await fetch(
			`${baseApiUrl}/subjects/${subject.subject_id}/assignments/${assignmentId}`,
			{
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (res.ok) {
			fetchSubjectAssignments(subject.subject_id).then((assignments) =>
				setApiSubjectAssignments(assignments)
			);
		} else {
			alert("Błąd usuwania ćwiczenia");
		}
	};

	const viewUserSolution = async (assignmentId: string) => {
		if (!subject || !subjectUser) return;

		const res = await fetch(
			`${baseApiUrl}/users/${subjectUser.user_id}/assignments/${assignmentId}/solution`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (res.ok) {
			const solution: Solution = await res.json();

			setApiSubjectUserAssignmentSolution(solution);
			setIsUserSolutionModalOpen(true);
		} else {
			alert("Błąd pobierania sprawozdania użytkownika.");

			setApiSubjectUserAssignmentSolution(null);
			setIsUserSolutionModalOpen(false);
		}
	};

	const handleSolutionUpdate = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (!apiSubjectUserAssignmentSolution) {
			return;
		}

		let { name, value } = e.target;

		if (name === "grade") {
			// @ts-expect-error ...
			value = Number(value);

			// @ts-expect-error ...
			if (value < 2 || value > 5) {
				return;
			}
		}

		setApiSubjectUserAssignmentSolution({
			...apiSubjectUserAssignmentSolution,
			[name]: value,
		});
	};

	const updateUserAssignmentSolution = async (assignmentId: string) => {
		if (!subject || !subjectUser) return;

		const res = await fetch(
			`${baseApiUrl}/users/${subjectUser.user_id}/assignments/${assignmentId}/solution`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(apiSubjectUserAssignmentSolution),
			}
		);

		if (res.ok) {
			setIsUserSolutionModalOpen(false);
		} else {
			alert("Błąd aktualizowania sprawozdania użytkownika.");
		}
	};

	const createSubject = async () => {
		const res = await fetch(`${baseApiUrl}/subjects`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newSubject),
		});

		if (res.ok) {
			fetchSubjects().then((subjects) => setApiSubjects(subjects));

			setIsNewSubjectModalOpen(false);

			setNewSubject({
				subject_name: "",
			});
		} else {
			alert("Błąd tworzenia przedmoitu");
		}
	};

	const handleNewSubjectChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		setNewSubject({ ...newSubject, [name]: value });
	};

	const deleteSubject = async () => {
		if (!subject) return;

		const res = await fetch(`${baseApiUrl}/subjects/${subject.subject_id}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			setSubject(undefined);
			fetchSubjects().then((subjects) => setApiSubjects(subjects));
		} else {
			alert("Błąd usuwania przedmoitu");
		}
	};

	useEffect(() => {
		fetchSubjects().then((subjects) => setApiSubjects(subjects));
	}, []);

	useEffect(() => {
		if (subject) {
			fetchSubjectAssignments(subject.subject_id).then((assignments) =>
				setApiSubjectAssignments(assignments)
			);

			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);
		}
	}, [subject]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.groupSpaceBetween}>
				<p>Wybierz przedmiot ktorym chcesz zarzadzac</p>

				<div className={styles.groupLocal}>
					<button
						className={`${styles.button} ${styles.buttonGreen}`}
						onClick={() => setIsNewSubjectModalOpen(true)}
					>
						Utwórz nowy przedmiot
					</button>

					<button
						className={`${styles.button} ${styles.buttonRed}`}
						onClick={deleteSubject}
						disabled={!subject}
					>
						Usuń przedmiot
					</button>
				</div>
			</div>

			<select
				className={styles.button}
				value={subject ? JSON.stringify(subject) : ""}
				onChange={handleSubjectChange}
			>
				<option value="" disabled>
					Wybierz przedmiot
				</option>

				{apiSubjects.map((subject) => (
					<option
						key={subject.subject_id}
						value={JSON.stringify(subject)}
					>
						{subject.subject_name}
					</option>
				))}
			</select>

			{subject && (
				<div className={styles.section}>
					<p>Wybrano przedmiot: {subject.subject_name}</p>

					<div className={styles.section}>
						<div className={styles.groupSpaceBetween}>
							<p>Studenci</p>

							<div className={styles.groupLocal}>
								<select
									className={styles.button}
									value={
										subjectUser
											? JSON.stringify(subjectUser)
											: ""
									}
									onChange={handleUserChange}
								>
									<option value="" disabled>
										Wybierz studenta
									</option>

									<optgroup label="Zapisani studenci">
										{apiSubjectEnrolledUsers.map((user) => (
											<option
												key={user.user_id}
												value={JSON.stringify(user)}
											>
												{user.name} {user.surname} (
												{user.email})
											</option>
										))}
									</optgroup>

									<optgroup label="Niezapisani studenci">
										{apiSubjectNotEnrolledUsers.map(
											(user) => (
												<option
													key={user.user_id}
													value={JSON.stringify(user)}
												>
													{user.name} {user.surname} (
													{user.email})
												</option>
											)
										)}
									</optgroup>
								</select>

								<button
									className={`${styles.button} ${styles.buttonGreen}`}
									onClick={addUserToSubject}
									disabled={
										!subjectUser ||
										apiSubjectEnrolledUsers.some(
											(u) =>
												u.user_id ===
												subjectUser.user_id
										)
									}
								>
									Dodaj studenta
								</button>

								<button
									className={`${styles.button} ${styles.buttonRed}`}
									onClick={removeUserFromSubject}
									disabled={
										!subjectUser ||
										!apiSubjectEnrolledUsers.some(
											(u) =>
												u.user_id ===
												subjectUser.user_id
										)
									}
								>
									Usuń wybranego studenta
								</button>
							</div>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.groupSpaceBetween}>
							<p>Cwiczenia</p>

							<button
								className={`${styles.button} ${styles.buttonGreen}`}
								onClick={() =>
									setIsAddAssignmentModalOpen(true)
								}
							>
								Dodaj cwiczenie
							</button>
						</div>

						<div className={styles.assignments}>
							{apiSubjectAssignments.length === 0 ? (
								<p>Brak ćwiczeń dla tego przedmiotu.</p>
							) : (
								apiSubjectAssignments.map((assignment) => (
									<div
										className={styles.assignment}
										key={assignment.assignment_id}
									>
										<p>{assignment.title}</p>

										<div className={styles.groupLocal}>
											<button
												className={`${styles.button} ${styles.buttonPrimary}`}
												onClick={() =>
													viewUserSolution(
														assignment.assignment_id
													)
												}
												disabled={
													!subjectUser ||
													!apiSubjectEnrolledUsers.some(
														(u) =>
															u.user_id ===
															subjectUser.user_id
													)
												}
											>
												Zobacz sprawozdanie wybranego
												studenta
											</button>

											<button
												className={`${styles.button} ${styles.buttonRed}`}
												onClick={() =>
													deleteAssignmentFromSubject(
														assignment.assignment_id
													)
												}
											>
												Usuń cwiczenie
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}

			{isNewSubjectModalOpen && (
				<Modal onClose={() => setIsNewSubjectModalOpen(false)}>
					<h2>Dodaj nowy przedmiot</h2>

					<div className={styles.modalContent}>
						<div>
							<label htmlFor="subject_name">Nazwa:</label>

							<input
								type="text"
								id="subject_name"
								name="subject_name"
								value={newSubject.subject_name}
								onChange={handleNewSubjectChange}
								className={styles.input}
							/>
						</div>

						<button
							className={`${styles.button} ${styles.buttonGreen}`}
							onClick={createSubject}
							disabled={!newSubject.subject_name}
						>
							Utwórz przedmiot
						</button>
					</div>
				</Modal>
			)}

			{isAddAssignmentModalOpen && (
				<Modal onClose={() => setIsAddAssignmentModalOpen(false)}>
					<h2>Dodaj nowe zadanie</h2>

					<div className={styles.modalContent}>
						<div>
							<label htmlFor="title">Tytuł:</label>

							<input
								type="text"
								id="title"
								name="title"
								value={subjectNewAssignment.title}
								onChange={handleNewAssignmentChange}
								className={styles.input}
							/>
						</div>

						<div>
							<label htmlFor="description">Opis:</label>

							<textarea
								id="description"
								name="description"
								value={subjectNewAssignment.description}
								onChange={handleNewAssignmentChange}
								className={styles.textarea}
							/>
						</div>

						<button
							className={`${styles.button} ${styles.buttonGreen}`}
							onClick={addAssignmentToSubject}
							disabled={
								!subjectNewAssignment.title ||
								!subjectNewAssignment.description
							}
						>
							Dodaj ćwiczenie
						</button>
					</div>
				</Modal>
			)}

			{isUserSolutionModalOpen && (
				<Modal onClose={() => setIsUserSolutionModalOpen(false)}>
					<h2>Sprawozdania studenta</h2>

					<div className={styles.modalContent}>
						{apiSubjectUserAssignmentSolution ? (
							<div style={{ display: "contents" }}>
								<div>
									<label htmlFor="grade">Ocena:</label>

									<input
										type="number"
										step={0.5}
										max={5}
										min={2}
										id="grade"
										name="grade"
										value={
											apiSubjectUserAssignmentSolution.grade
										}
										className={styles.input}
										onChange={handleSolutionUpdate}
									/>
								</div>

								<div>
									<label htmlFor="review_comment">
										Komentarz:
									</label>

									<textarea
										id="review_comment"
										name="review_comment"
										value={
											apiSubjectUserAssignmentSolution.review_comment
										}
										className={styles.input}
										onChange={handleSolutionUpdate}
									/>
								</div>

								<button
									className={`${styles.button} ${styles.buttonPrimary}`}
									onClick={() => {
										if (!subjectUser) return;

										const blob = new Blob(
											[
												atob(
													apiSubjectUserAssignmentSolution.solution_data
												)!,
											],
											{ type: "application/zip" }
										);
										const url =
											window.URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = `sprawozdanie_${subjectUser.user_id}_${apiSubjectUserAssignmentSolution.solution_id}.zip`;
										document.body.appendChild(a);
										a.click();
										window.URL.revokeObjectURL(url);
										document.body.removeChild(a);
									}}
								>
									Pobierz dane sprawozdania
								</button>

								<button
									className={`${styles.button} ${styles.buttonGreen}`}
									onClick={() => {
										updateUserAssignmentSolution(
											apiSubjectUserAssignmentSolution.assignment_id
										);
									}}
								>
									Zaktualizuj sprawozdanie
								</button>
							</div>
						) : (
							<p>Brak sprawozdania dla studenta.</p>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
}

// Subject:
//     subject_id: str
//     subject_name: str

// Assignment:
//     assignment_id: str
//     subject_id: str
//     title: str
//     description: str
//     accepted_mime_types: str

// User:
//     user_id: str
//     email: str
//     name: str
//     surname: str

// Solution:
//     solution_id: str
//     grade: float
//     submission_date: float
//     solution_data: bytes
//     review_comment: str
//     review_date: str
//     mime_type: str

// 1. GET /api/subjects
// Opis: Zwraca listę wszystkich przedmiotów.

// Zwraca: List[Subject]

// [
//   {"subject_id": "1", "subject_name": "Matma"},
//   {"subject_id": "2", "subject_name": "Przyrka"},
//   {"subject_id": "3", "subject_name": "Geografia"}
// ]

// 2. POST /api/subjects
// Opis: Dodaje nowy przedmiot do subjects_db.

// Oczekuje: JSON:

// {
//   "subject_name": "Biologia"
// }

// 3. DELETE /api/subject/<subject_id>

// Opis: Usuwa przedmiot o podanym subject_id.

// 4. GET /api/subjects/<subject_id>/assignments
// Opis: Zwraca listę zadań przypisanych do danego przedmiotu.

// Zwraca: List[Assignment] lub pustą listę [] jeśli brak

// 5. GET /api/subjects/<subject_id>/users/enrolled
// Opis: Zwraca użytkowników zapisanych do danego przedmiotu.

// Zwraca: List[User]

// 6. GET /api/subjects/<subject_id>/users/not-enrolled
// Opis: Zwraca użytkowników niezapisanych do danego przedmiotu.

// Zwraca: List[User]

// 7. POST /api/subjects/<subject_id>/users/<user_id>
// Opis: Zapisuje użytkownika do danego przedmiotu.

// 8. DELETE /api/subjects/<subject_id>/users/<user_id>
// Opis: Usuwa użytkownika z danego przedmiotu.

// 9. POST /api/subjects/<subject_id>/assignments
// Opis: Tworzy nowe zadanie dla danego przedmiotu.

// Oczekuje: JSON:

// {
//   "title": "Cwiczenie 1",
//   "description": "Opis"
// }

// 10. DELETE /api/subjects/<subject_id>/assignments/<assignment_id>
// Opis: Usuwa zadanie o podanym ID z danego przedmiotu.

// 11. GET /api/users/<user_id>/assignments/<assignment_id>/solution
// Opis: Zwraca rozwiązanie danego użytkownika dla konkretnego zadania.

// Zwraca (sukces):

// {
//   "solution_id": "1001",
//   "grade": 4.5,
//   "submission_date": 1672531200.0,
//   "solution_data": "base64_encoded_string",
//   "review_comment": "Dobrze wykonane, ale brakuje kilku szczegółów",
//   "review_date": "2023-01-02",
//   "mime_type": "text/plain",
//   "assignment_id": "101" <------ BARDZO WAŻNE!!
// }

// Brak rozwiązania: null

// 12. PUT /api/users/<user_id>/assignments/<assignment_id>/solution
// Opis: Aktualizacja rozwiązania.

// Oczekuje: JSON:

// {
//   "grade": 5,
//   "review_comment": "Opis"
// }
