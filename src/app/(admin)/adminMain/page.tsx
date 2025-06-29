// src/app/(user)/userPage/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/adminPage.module.css";
import Modal from "@/components/ui/Modals/Generic";
import { sha256 } from "js-sha256";

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

type Role = {
	role_id: string;
	name: string;
};

type RoleData = {
	role_id: string;
};

type SubjectRole = {
	subject_id: string;
	role_id: string;
};

type NewRoleForm = {
	role_id: string;
	name: string;
};

type NewSubjectForm = {
	subject_name: string;
};

type NewAssignmentForm = {
	title: string;
	description: string;
	accepted_mime_types: string;
};

type NewUserForm = {
	email: string;
	password_hash: string;
	student_id: string;
	name: string;
	surname: string;
	is_admin: boolean;
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

	const [apiRoles, setApiRoles] = useState<Role[]>([]);
	const [userRoles, setUserRoles] = useState<Role[]>([]);
	const [subjectRoles, setSubjectRoles] = useState<Role[]>([]);

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

	const [newUser, setNewUser] = useState<NewUserForm>({
		email: "",
		password_hash: "",
		student_id: "",
		name: "",
		surname: "",
		is_admin: false,
	});

	const [newRole, setNewRole] = useState<NewRoleForm>({
		role_id: "",
		name: "",
	});

	const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] =
		useState<boolean>(false);

	const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] =
		useState<boolean>(false);

	const [isUserSolutionModalOpen, setIsUserSolutionModalOpen] =
		useState<boolean>(false);

	const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	const [isNewUserModalOpen, setIsNewUserModalOpen] = useState<boolean>(false);
	const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState<boolean>(false);
	const [isEditUserRolesModalOpen, setIsEditUserRolesModalOpen] = useState<boolean>(false);
	const [userSearchTerm, setUserSearchTerm] = useState<string>("");
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

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

	const fetchRoles = async (): Promise<Role[]> => {
		const res = await fetch(`${baseApiUrl}/roles`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			alert("Błąd pobierania ról");
			return [];
		}

		return await res.json();
	};

	const fetchUserRoles = async (userId: string): Promise<Role[]> => {
		const res = await fetch(`${baseApiUrl}/users/${userId}/roles`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			if (res.status === 401) {
				// User not authorized to view roles, return empty array
				return [];
			}
			alert("Błąd pobierania ról użytkownika");
			return [];
		}

		const responseData = await res.json();
		return responseData.roles || [];
	};

	const fetchSubjectRoles = async (subjectId: string): Promise<Role[]> => {
		const res = await fetch(`${baseApiUrl}/subjects/${subjectId}/roles`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			alert("Błąd pobierania ról przedmiotu");
			return [];
		}

		const responseData = await res.json();
		return responseData.roles || [];
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

		// Fetch current user roles and open role selection modal
		const currentRoles = await fetchUserRoles(subjectUser.user_id);
		setUserRoles(currentRoles);
		setSelectedRoles([]); // Don't pre-select any roles - let user choose
		setIsRoleModalOpen(true);
	};

	const handleRoleSelection = (roleId: string, checked: boolean) => {
		if (checked) {
			setSelectedRoles([...selectedRoles, roleId]);
		} else {
			setSelectedRoles(selectedRoles.filter(id => id !== roleId));
		}
	};

	const addRoleToUser = async (roleId: string) => {
		if (!subjectUser) return;

		const roleData: RoleData = {
			role_id: roleId,
		};

		const res = await fetch(`${baseApiUrl}/user/${subjectUser.user_id}/role`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(roleData),
		});

		if (res.ok) {
			// Refresh user roles
			const updatedRoles = await fetchUserRoles(subjectUser.user_id);
			setUserRoles(updatedRoles);

			// Refresh user lists
			if (subject) {
				fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
					setApiSubjectEnrolledUsers(users)
				);

				fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
					setApiSubjectNotEnrolledUsers(users)
				);
			}
		} else {
			alert("Błąd dodawania roli do użytkownika");
		}
	};

	const removeRoleFromUser = async (roleId: string) => {
		if (!subjectUser || !subject) return;

		const roleData: RoleData = {
			role_id: roleId,
		};

		const res = await fetch(`${baseApiUrl}/user/${subjectUser.user_id}/role`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(roleData),
		});

		if (res.ok) {
			// Refresh user roles
			const updatedRoles = await fetchUserRoles(subjectUser.user_id);
			setUserRoles(updatedRoles);

			// Refresh enrolled and not enrolled user lists
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);
		} else {
			alert("Błąd usuwania roli");
		}
	};

	const saveUserRoles = async () => {
		if (!subjectUser || !subject) return;

		// Only add roles that the user doesn't already have
		const newRoles = selectedRoles.filter(roleId => 
			!userRoles.some(userRole => userRole.role_id === roleId)
		);

		if (newRoles.length === 0) {
			alert("Nie wybrano żadnych nowych ról do dodania");
			return;
		}

		let successCount = 0;
		let errorCount = 0;

		for (const roleId of newRoles) {
			const roleData: RoleData = {
				role_id: roleId,
			};

			const res = await fetch(`${baseApiUrl}/user/${subjectUser.user_id}/role`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(roleData),
			});

			if (res.ok) {
				successCount++;
			} else {
				errorCount++;
			}
		}

		if (successCount > 0) {
			// Refresh user lists
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);

			// Refresh user roles
			const updatedRoles = await fetchUserRoles(subjectUser.user_id);
			setUserRoles(updatedRoles);
		}

		// Only show error notifications
		if (errorCount > 0) {
			alert(`Błąd podczas dodawania ${errorCount} ról`);
		}

		// Reset selected roles
		setSelectedRoles([]);
	};

	const removeUserFromSubject = async () => {
		if (!subject || !subjectUser) return;

		// Get user roles and subject roles
		const userRoles = await fetchUserRoles(subjectUser.user_id);
		const subjectRoles = await fetchSubjectRoles(subject.subject_id);
		
		// Find common roles between user and subject
		const commonRoles = userRoles.filter(userRole => 
			subjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
		);
		
		// Remove only the common roles
		let rolesRemoved = 0;
		for (const role of commonRoles) {
			const roleData: RoleData = {
				role_id: role.role_id,
			};

			const res = await fetch(`${baseApiUrl}/user/${subjectUser.user_id}/role`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(roleData),
			});

			if (res.ok) {
				rolesRemoved++;
			}
		}

		// Refresh user lists after removing roles
		fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
			setApiSubjectEnrolledUsers(users)
		);

		fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
			setApiSubjectNotEnrolledUsers(users)
		);

		// Refresh user roles if the modal is open
		if (isEditUserRolesModalOpen) {
			const updatedRoles = await fetchUserRoles(subjectUser.user_id);
			setUserRoles(updatedRoles);
		}

		setSubjectUser(null);
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

	const createUser = async () => {
		// Prepare the data according to the API structure
		const accountData = {
			email: newUser.email,
			password_hash: sha256(newUser.password_hash),
			student_id: newUser.student_id || null, // Convert empty string to null for Option<String>
			name: newUser.name,
			surname: newUser.surname,
			is_admin: newUser.is_admin,
		};

		const res = await fetch(`${baseApiUrl}/account`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(accountData),
		});

		if (res.ok) {
			// Refresh user lists if a subject is selected
			if (subject) {
				fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
					setApiSubjectEnrolledUsers(users)
				);

				fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
					setApiSubjectNotEnrolledUsers(users)
				);
			}

			setIsNewUserModalOpen(false);

			// Reset form
			setNewUser({
				email: "",
				password_hash: "",
				student_id: "",
				name: "",
				surname: "",
				is_admin: false,
			});
		} else {
			alert("Błąd tworzenia użytkownika");
		}
	};

	const handleNewUserChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setNewUser({ ...newUser, [name]: checked });
		} else {
			setNewUser({ ...newUser, [name]: value });
		}
	};

	const addRoleToSubject = async (roleId: string) => {
		if (!subject) return;

		const subjectRole: SubjectRole = {
			subject_id: subject.subject_id,
			role_id: roleId,
		};

		const res = await fetch(`${baseApiUrl}/subjects/add-role`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(subjectRole),
		});

		if (res.ok) {
			// Refresh subject roles
			fetchSubjectRoles(subject.subject_id).then((roles) =>
				setSubjectRoles(roles)
			);
		} else if (res.status === 409) {
			alert("Rola jest już przypisana do tego przedmiotu");
		} else {
			alert("Błąd dodawania roli do przedmiotu");
		}
	};

	const removeRoleFromSubject = async (roleId: string) => {
		if (!subject) return;

		const requestData = {
			role_id: roleId,
			subject_id: subject.subject_id,
		};

		const res = await fetch(`${baseApiUrl}/subjects/add-role`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		if (res.ok) {
			// Refresh subject roles
			fetchSubjectRoles(subject.subject_id).then((roles) =>
				setSubjectRoles(roles)
			);
		} else {
			alert("Błąd usuwania roli z przedmiotu");
		}
	};

	const createGlobalRole = async () => {
		// Generate a unique role ID with timestamp and random string to minimize conflicts
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 8);
		const generatedRoleId = `role_${timestamp}_${randomString}`;

		const roleData = {
			role_id: generatedRoleId,
			name: newRole.name,
		};

		const res = await fetch(`${baseApiUrl}/roles`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(roleData),
		});

		if (res.ok) {
			// Refresh all roles
			fetchRoles().then((roles) => setApiRoles(roles));
			
			// Refresh subject roles if subject is selected
			if (subject) {
				fetchSubjectRoles(subject.subject_id).then((roles) =>
					setSubjectRoles(roles)
				);
			}

			// Reset form
			setNewRole({
				role_id: "",
				name: "",
			});
		} else {
			alert("Błąd tworzenia roli");
		}
	};

	const deleteGlobalRole = async (roleId: string) => {
		const res = await fetch(`${baseApiUrl}/roles/${roleId}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			// Refresh all roles
			fetchRoles().then((roles) => setApiRoles(roles));
			
			// Refresh subject roles if subject is selected
			if (subject) {
				fetchSubjectRoles(subject.subject_id).then((roles) =>
					setSubjectRoles(roles)
				);
			}
		} else {
			alert("Błąd usuwania roli");
		}
	};

	const handleNewRoleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNewRole({ ...newRole, [name]: value });
	};

	const filterUsers = (users: User[], searchTerm: string): User[] => {
		if (!searchTerm.trim()) return users;
		
		const lowerSearchTerm = searchTerm.toLowerCase();
		return users.filter(user => 
			(user.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
			(user.surname?.toLowerCase() || '').includes(lowerSearchTerm) ||
			(user.email?.toLowerCase() || '').includes(lowerSearchTerm)
		);
	};

	useEffect(() => {
		fetchSubjects().then((subjects) => setApiSubjects(subjects));
		fetchRoles().then((roles) => setApiRoles(roles));
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest('[data-dropdown]')) {
				setIsUserDropdownOpen(false);
			}
		};

		if (isUserDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isUserDropdownOpen]);

	return (
		<div className={styles.wrapper}>
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
				<button
					className={`${styles.button} ${styles.buttonGreen}`}
					onClick={() => setIsNewUserModalOpen(true)}
				>
					Dodaj nowego użytkownika
				</button>
			</div>

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

					<button
						className={`${styles.button} ${styles.buttonPrimary}`}
						onClick={() => {
							if (subject) {
								fetchSubjectRoles(subject.subject_id).then((roles) =>
									setSubjectRoles(roles)
								);
								setIsEditRolesModalOpen(true);
							}
						}}
						disabled={!subject}
					>
						Edytuj role
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
								<div style={{ position: "relative", width: "100%" }} data-dropdown>
									<button
										className={styles.button}
										onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
										style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
									>
										{subjectUser ? `${subjectUser.name} ${subjectUser.surname} (${subjectUser.email})` : "Wybierz studenta"}
										<span>▼</span>
									</button>

									{isUserDropdownOpen && (
										<div style={{
											position: "absolute",
											top: "100%",
											left: 0,
											right: 0,
											backgroundColor: "white",
											border: "1px solid #ccc",
											borderRadius: "4px",
											maxHeight: "300px",
											overflowY: "auto",
											zIndex: 1000,
											boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
										}}>
											<input
												type="text"
												placeholder="Wyszukaj studenta..."
												value={userSearchTerm}
												onChange={(e) => setUserSearchTerm(e.target.value)}
												style={{
													width: "100%",
													padding: "8px",
													border: "none",
													borderBottom: "1px solid #eee",
													outline: "none"
												}}
												onClick={(e) => e.stopPropagation()}
											/>

											<div style={{ padding: "4px 0" }}>
												<div style={{ 
													padding: "4px 8px", 
													fontWeight: "bold", 
													backgroundColor: "#f5f5f5",
													fontSize: "12px",
													color: "#666"
												}}>
													Zapisani studenci
												</div>
												{filterUsers(apiSubjectEnrolledUsers, userSearchTerm).map((user) => (
													<div
														key={user.user_id}
														onClick={() => {
															setSubjectUser(user);
															setIsUserDropdownOpen(false);
															setUserSearchTerm("");
														}}
														style={{
															padding: "8px 12px",
															cursor: "pointer",
															borderBottom: "1px solid #f0f0f0",
															backgroundColor: subjectUser?.user_id === user.user_id ? "#e3f2fd" : "white"
														}}
														onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
														onMouseLeave={(e) => e.currentTarget.style.backgroundColor = subjectUser?.user_id === user.user_id ? "#e3f2fd" : "white"}
													>
														{user.name} {user.surname} ({user.email})
													</div>
												))}
											</div>

											<div style={{ padding: "4px 0" }}>
												<div style={{ 
													padding: "4px 8px", 
													fontWeight: "bold", 
													backgroundColor: "#f5f5f5",
													fontSize: "12px",
													color: "#666"
												}}>
													Niezapisani studenci
												</div>
												{filterUsers(apiSubjectNotEnrolledUsers, userSearchTerm).map((user) => (
													<div
														key={user.user_id}
														onClick={() => {
															setSubjectUser(user);
															setIsUserDropdownOpen(false);
															setUserSearchTerm("");
														}}
														style={{
															padding: "8px 12px",
															cursor: "pointer",
															borderBottom: "1px solid #f0f0f0",
															backgroundColor: subjectUser?.user_id === user.user_id ? "#e3f2fd" : "white"
														}}
														onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
														onMouseLeave={(e) => e.currentTarget.style.backgroundColor = subjectUser?.user_id === user.user_id ? "#e3f2fd" : "white"}
													>
														{user.name} {user.surname} ({user.email})
													</div>
												))}
											</div>
										</div>
									)}
								</div>

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
									style={{ height: "100px", minHeight: "100px", padding: "12px 8px" }}
								>
									Usuń role użytkownika powiązane z tym przedmiotem
								</button>

								<button
									className={`${styles.button} ${styles.buttonPrimary}`}
									onClick={() => {
										if (subjectUser) {
											fetchUserRoles(subjectUser.user_id).then((roles) =>
												setUserRoles(roles)
											);
											setIsEditUserRolesModalOpen(true);
										}
									}}
									disabled={!subjectUser}
									style={{ height: "100px", minHeight: "100px", padding: "12px 8px" }}
								>
									Edytuj role użytkownika
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

			{isRoleModalOpen && (
				<Modal onClose={() => setIsRoleModalOpen(false)}>
					<h2>Zarządzaj rolami użytkownika</h2>

					<div className={styles.modalContent}>
						{subjectUser && subject && (
							<div>
								<p>
									<strong>Użytkownik:</strong> {subjectUser.name}{" "}
									{subjectUser.surname} ({subjectUser.email})
								</p>
								<p>
									<strong>Przedmiot:</strong> {subject.subject_name}
								</p>
							</div>
						)}

						{userRoles.length > 0 && (
							<div style={{ marginBottom: "20px" }}>
								<p><strong>Aktualne role użytkownika:</strong></p>
								{userRoles.map((role) => (
									<div key={role.role_id} style={{ 
										display: "flex", 
										justifyContent: "space-between", 
										alignItems: "center",
										marginBottom: "8px",
										padding: "8px",
										border: "1px solid #ddd",
										borderRadius: "4px",
										backgroundColor: "#f9f9f9"
									}}>
										<span>{role.name}</span>
										<button
											className={`${styles.button} ${styles.buttonRed}`}
											onClick={() => removeRoleFromUser(role.role_id)}
											style={{ padding: "4px 8px", fontSize: "12px" }}
										>
											Usuń
										</button>
									</div>
								))}
							</div>
						)}

						<div>
							<label>Wybierz role do dodania:</label>

							<div style={{ marginTop: "10px" }}>
								{apiRoles
									.filter(role => !userRoles.some(userRole => userRole.role_id === role.role_id))
									.map((role) => (
										<div key={role.role_id} style={{ marginBottom: "8px" }}>
											<input
												type="checkbox"
												id={role.role_id}
												checked={selectedRoles.includes(role.role_id)}
												onChange={(e) => handleRoleSelection(role.role_id, e.target.checked)}
											/>
											<label htmlFor={role.role_id} style={{ marginLeft: "8px" }}>
												{role.name}
											</label>
										</div>
									))}
							</div>
						</div>

						{apiRoles.filter(role => !userRoles.some(userRole => userRole.role_id === role.role_id)).length === 0 && (
							<p style={{ fontStyle: "italic", color: "#666" }}>
								Użytkownik ma już wszystkie dostępne role.
							</p>
						)}

						<button
							className={`${styles.button} ${styles.buttonGreen}`}
							onClick={saveUserRoles}
							disabled={selectedRoles.filter(roleId => !userRoles.some(userRole => userRole.role_id === roleId)).length === 0}
						>
							Dodaj wybrane role
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

			{isNewUserModalOpen && (
				<Modal onClose={() => setIsNewUserModalOpen(false)}>
					<h2>Dodaj nowego użytkownika</h2>

					<div className={styles.modalContent}>
						<div>
							<label htmlFor="email">Email:</label>
							<input
								type="email"
								id="email"
								name="email"
								value={newUser.email}
								onChange={handleNewUserChange}
								className={styles.input}
								required
							/>
						</div>

						<div>
							<label htmlFor="password_hash">Hasło:</label>
							<input
								type="password"
								id="password_hash"
								name="password_hash"
								value={newUser.password_hash}
								onChange={handleNewUserChange}
								className={styles.input}
								required
							/>
						</div>

						<div>
							<label htmlFor="student_id">ID studenta (opcjonalne):</label>
							<input
								type="text"
								id="student_id"
								name="student_id"
								value={newUser.student_id}
								onChange={handleNewUserChange}
								className={styles.input}
							/>
						</div>

						<div>
							<label htmlFor="name">Imię:</label>
							<input
								type="text"
								id="name"
								name="name"
								value={newUser.name}
								onChange={handleNewUserChange}
								className={styles.input}
								required
							/>
						</div>

						<div>
							<label htmlFor="surname">Nazwisko:</label>
							<input
								type="text"
								id="surname"
								name="surname"
								value={newUser.surname}
								onChange={handleNewUserChange}
								className={styles.input}
								required
							/>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<input
								type="checkbox"
								id="is_admin"
								name="is_admin"
								checked={newUser.is_admin}
								onChange={handleNewUserChange}
							/>
							<label htmlFor="is_admin">Administrator</label>
						</div>

						<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
							<button
								className={`${styles.button} ${styles.buttonGreen}`}
								onClick={createUser}
								disabled={
									!newUser.email ||
									!newUser.password_hash ||
									!newUser.name ||
									!newUser.surname
								}
							>
								Dodaj
							</button>

							<button
								className={`${styles.button} ${styles.buttonRed}`}
								onClick={() => setIsNewUserModalOpen(false)}
							>
								Anuluj
							</button>
						</div>
					</div>
				</Modal>
			)}

			{isEditRolesModalOpen && (
				<Modal onClose={() => setIsEditRolesModalOpen(false)}>
					<h2>Zarządzanie rolami</h2>

					<div className={styles.modalContent} style={{ maxHeight: "80vh", overflowY: "auto" }}>
						{subject && (
							<div style={{ marginBottom: "20px" }}>
								<p><strong>Przedmiot:</strong> {subject.subject_name}</p>
							</div>
						)}

						{/* Subject Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Role przypisane do przedmiotu</h3>
							{subjectRoles.length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Brak ról przypisanych do tego przedmiotu.
								</p>
							) : (
								<div>
									{subjectRoles.map((role) => (
										<div key={role.role_id} style={{ 
											display: "flex", 
											justifyContent: "space-between", 
											alignItems: "center",
											marginBottom: "8px",
											padding: "8px",
											border: "1px solid #ddd",
											borderRadius: "4px",
											backgroundColor: "#f9f9f9"
										}}>
											<span>{role.name}</span>
											<button
												className={`${styles.button} ${styles.buttonRed}`}
												onClick={() => removeRoleFromSubject(role.role_id)}
												style={{ padding: "4px 8px", fontSize: "12px" }}
											>
												Usuń z przedmiotu
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Available Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Dostępne role (nieprzypisane do przedmiotu)</h3>
							{apiRoles.filter(role => !subjectRoles.some(subjectRole => subjectRole.role_id === role.role_id)).length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Wszystkie role są już przypisane do tego przedmiotu.
								</p>
							) : (
								<div>
									{apiRoles
										.filter(role => !subjectRoles.some(subjectRole => subjectRole.role_id === role.role_id))
										.map((role) => (
											<div key={role.role_id} style={{ 
												display: "flex", 
												justifyContent: "space-between", 
												alignItems: "center",
												marginBottom: "8px",
												padding: "8px",
												border: "1px solid #ddd",
												borderRadius: "4px",
												backgroundColor: "#f0f8ff"
											}}>
												<span>{role.name}</span>
												<button
													className={`${styles.button} ${styles.buttonGreen}`}
													onClick={() => addRoleToSubject(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
												>
													Dodaj do przedmiotu
												</button>
											</div>
										))}
								</div>
							)}
						</div>

						{/* Global Role Management Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Zarządzanie globalnymi rolami</h3>
							
							{/* Add New Global Role */}
							<div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fafafa" }}>
								<h4>Dodaj nową rolę globalną</h4>
								<div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
									<input
										type="text"
										placeholder="Nazwa roli"
										name="name"
										value={newRole.name}
										onChange={handleNewRoleChange}
										className={styles.input}
										style={{ flex: 1 }}
									/>
									<button
										className={`${styles.button} ${styles.buttonGreen}`}
										onClick={createGlobalRole}
										disabled={!newRole.name}
									>
										Dodaj rolę
									</button>
								</div>
							</div>

							{/* All Global Roles */}
							<div>
								<h4>Wszystkie role globalne</h4>
								{apiRoles.length === 0 ? (
									<p style={{ fontStyle: "italic", color: "#666" }}>
										Brak ról globalnych.
									</p>
								) : (
									<div>
										{apiRoles.map((role) => (
											<div key={role.role_id} style={{ 
												display: "flex", 
												justifyContent: "space-between", 
												alignItems: "center",
												marginBottom: "8px",
												padding: "8px",
												border: "1px solid #ddd",
												borderRadius: "4px",
												backgroundColor: "#fff3cd"
											}}>
												<span>{role.name}</span>
												<button
													className={`${styles.button} ${styles.buttonRed}`}
													onClick={() => deleteGlobalRole(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
												>
													Usuń globalnie
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
							<button
								className={`${styles.button} ${styles.buttonPrimary}`}
								onClick={() => setIsEditRolesModalOpen(false)}
							>
								Zamknij
							</button>
						</div>
					</div>
				</Modal>
			)}

			{isEditUserRolesModalOpen && (
				<Modal onClose={() => setIsEditUserRolesModalOpen(false)}>
					<h2>Zarządzanie rolami użytkownika</h2>

					<div className={styles.modalContent} style={{ maxHeight: "80vh", overflowY: "auto" }}>
						{subjectUser && (
							<div style={{ marginBottom: "20px" }}>
								<p><strong>Użytkownik:</strong> {subjectUser.name} {subjectUser.surname} ({subjectUser.email})</p>
							</div>
						)}

						{/* User Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Role przypisane do użytkownika</h3>
							{userRoles.length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Brak ról przypisanych do tego użytkownika.
								</p>
							) : (
								<div>
									{userRoles.map((role) => (
										<div key={role.role_id} style={{ 
											display: "flex", 
											justifyContent: "space-between", 
											alignItems: "center",
											marginBottom: "8px",
											padding: "8px",
											border: "1px solid #ddd",
											borderRadius: "4px",
											backgroundColor: "#f9f9f9"
										}}>
											<span>{role.name}</span>
											<button
												className={`${styles.button} ${styles.buttonRed}`}
												onClick={() => removeRoleFromUser(role.role_id)}
												style={{ padding: "4px 8px", fontSize: "12px" }}
											>
												Usuń z użytkownika
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Available Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Dostępne role (nieprzypisane do użytkownika)</h3>
							{apiRoles.filter(role => !userRoles.some(userRole => userRole.role_id === role.role_id)).length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Użytkownik ma już wszystkie dostępne role.
								</p>
							) : (
								<div>
									{apiRoles
										.filter(role => !userRoles.some(userRole => userRole.role_id === role.role_id))
										.map((role) => (
											<div key={role.role_id} style={{ 
												display: "flex", 
												justifyContent: "space-between", 
												alignItems: "center",
												marginBottom: "8px",
												padding: "8px",
												border: "1px solid #ddd",
												borderRadius: "4px",
												backgroundColor: "#f0f8ff"
											}}>
												<span>{role.name}</span>
												<button
													className={`${styles.button} ${styles.buttonGreen}`}
													onClick={() => addRoleToUser(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
												>
													Dodaj do użytkownika
												</button>
											</div>
										))}
								</div>
							)}
						</div>

						<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
							<button
								className={`${styles.button} ${styles.buttonPrimary}`}
								onClick={() => setIsEditUserRolesModalOpen(false)}
							>
								Zamknij
							</button>
						</div>
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
