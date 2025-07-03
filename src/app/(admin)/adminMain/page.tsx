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
	grade?: number | null;
	submission_date: string;
	solution_data: number[];
	reviewed_by?: string | null;
	review_comment?: string | null;
	review_date?: string | null;
	mime_type: string;
};

type AllUser = {
	user_id: string;
	name: string;
	surname: string;
	email: string;
	student_id?: string;
	is_admin: boolean;
};

type EditUserForm = {
	password_hash: string;
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

	// Edit user states
	const [isEditUserModalOpen, setIsEditUserModalOpen] = useState<boolean>(false);
	const [allUsers, setAllUsers] = useState<AllUser[]>([]);
	const [selectedUserForEdit, setSelectedUserForEdit] = useState<AllUser | null>(null);
	const [editUserForm, setEditUserForm] = useState<EditUserForm>({
		password_hash: "",
	});
	const [editUserSearchTerm, setEditUserSearchTerm] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isNewUserPasswordVisible, setIsNewUserPasswordVisible] = useState<boolean>(false);

	// [1] Dodaj nowe stany na mapę ocen i istnienie rozwiązania
	const [userSolutionGradeMap, setUserSolutionGradeMap] = useState<Record<string, number | null | undefined>>({});
	const [userSolutionExistsMap, setUserSolutionExistsMap] = useState<Record<string, boolean>>({});

	// Dodaj stan na aktualną rolę edytującą
	const [currentEditorRole, setCurrentEditorRole] = useState<Role | null>(null);

	// Dodaj stan na listę ról edytujących w różnych przedmiotach
	const [editorRolesInSubjects, setEditorRolesInSubjects] = useState<Set<string>>(new Set());

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

	const fetchAllUsers = async (): Promise<AllUser[]> => {
		const res = await fetch(`${baseApiUrl}/users`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			alert("Błąd pobierania listy użytkowników");
			return [];
		}

		return await res.json();
	};

	const updateUserPassword = async (userId: string, passwordHash: string): Promise<boolean> => {
		const res = await fetch(`${baseApiUrl}/users/${userId}/login`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				passwd_hash: passwordHash,
			}),
		});

		if (!res.ok) {
			if (res.status === 403) {
				alert("Brak uprawnień do modyfikacji tego użytkownika");
			} else {
				alert("Błąd aktualizacji hasła użytkownika");
			}
			return false;
		}

		return true;
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
		if (!subjectUser || !subject) return;

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
			// Refresh user roles with subject filtering
			const [allUserRoles, allSubjectRoles] = await Promise.all([
				fetchUserRoles(subjectUser.user_id),
				fetchSubjectRoles(subject.subject_id)
			]);
			
			// Calculate intersection: roles that user has AND are assigned to subject
			const userRolesForSubject = allUserRoles.filter(userRole =>
				allSubjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
			);
			
			setUserRoles(userRolesForSubject);

			// Refresh enrolled and not enrolled user lists
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectEnrolledUsers(users)
			);

			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) =>
				setApiSubjectNotEnrolledUsers(users)
			);
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
			// Refresh user roles with subject filtering
			const [allUserRoles, allSubjectRoles] = await Promise.all([
				fetchUserRoles(subjectUser.user_id),
				fetchSubjectRoles(subject.subject_id)
			]);
			
			// Calculate intersection: roles that user has AND are assigned to subject
			const userRolesForSubject = allUserRoles.filter(userRole =>
				allSubjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
			);
			
			setUserRoles(userRolesForSubject);

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

			// Refresh user roles with subject filtering
			const [allUserRoles, allSubjectRoles] = await Promise.all([
				fetchUserRoles(subjectUser.user_id),
				fetchSubjectRoles(subject.subject_id)
			]);
			
			// Calculate intersection: roles that user has AND are assigned to subject
			const userRolesForSubject = allUserRoles.filter(userRole =>
				allSubjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
			);
			
			setUserRoles(userRolesForSubject);
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
			const [allUserRoles, allSubjectRoles] = await Promise.all([
				fetchUserRoles(subjectUser.user_id),
				fetchSubjectRoles(subject.subject_id)
			]);
			
			// Calculate intersection: roles that user has AND are assigned to subject
			const userRolesForSubject = allUserRoles.filter(userRole =>
				allSubjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
			);
			
			setUserRoles(userRolesForSubject);
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

	// [1] Przenieś fetchAllSolutions na górę, aby był dostępny w całym komponencie
	const fetchAllSolutions = async (userId: string, assignments: Assignment[]) => {
		const gradeMap: Record<string, number | null | undefined> = {};
		const existsMap: Record<string, boolean> = {};
		for (const assignment of assignments) {
			try {
				const res = await fetch(`${baseApiUrl}/users/${userId}/assignments/${assignment.assignment_id}/solution`, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				});
				existsMap[assignment.assignment_id] = res.ok;
				if (res.ok) {
					const json: Solution = await res.json();
					gradeMap[assignment.assignment_id] = json.grade;
				} else {
					gradeMap[assignment.assignment_id] = undefined;
				}
			} catch {
				existsMap[assignment.assignment_id] = false;
				gradeMap[assignment.assignment_id] = undefined;
			}
		}
		setUserSolutionGradeMap(gradeMap);
		setUserSolutionExistsMap(existsMap);
	};

	// [2] Użyj fetchAllSolutions w useEffect
	useEffect(() => {
		if (!subjectUser || !apiSubjectAssignments.length) {
			setUserSolutionGradeMap({});
			setUserSolutionExistsMap({});
			return;
		}
		fetchAllSolutions(subjectUser.user_id, apiSubjectAssignments);
	}, [subjectUser, apiSubjectAssignments]);

	const updateUserAssignmentSolution = async (assignmentId: string) => {
		if (!subject || !subjectUser) return;

		// Przygotuj dane do wysłania
		let solutionToSend = apiSubjectUserAssignmentSolution;
		if (!solutionToSend?.review_comment?.trim()) {
			// Upewnij się, że solution_id i assignment_id są stringami
			const { solution_id = "", assignment_id = assignmentId, ...rest } = solutionToSend || {};
			solutionToSend = { ...rest, solution_id, assignment_id, review_comment: "." } as Solution;
		}

		if (!solutionToSend?.solution_id || !solutionToSend?.assignment_id) {
			alert("Brak wymaganych danych do wysłania sprawozdania.");
			return;
		}

		const res = await fetch(
			`${baseApiUrl}/users/${subjectUser.user_id}/assignments/${assignmentId}/solution`,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(solutionToSend),
			}
		);

		if (res.ok) {
			setIsUserSolutionModalOpen(false);
			// Odśwież oceny po ocenie sprawozdania
			fetchAllSolutions(subjectUser.user_id, apiSubjectAssignments);
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
			setIsNewUserPasswordVisible(false);

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

	const filterAllUsers = (users: AllUser[], searchTerm: string): AllUser[] => {
		if (!searchTerm.trim()) return users;
		
		const lowerSearchTerm = searchTerm.toLowerCase();
		return users.filter(user => 
			(user.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
			(user.surname?.toLowerCase() || '').includes(lowerSearchTerm) ||
			(user.email?.toLowerCase() || '').includes(lowerSearchTerm) ||
			(user.student_id?.toLowerCase() || '').includes(lowerSearchTerm)
		);
	};

	const handleEditUserChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditUserForm({ ...editUserForm, [name]: value });
	};

	const handleEditUserPassword = async () => {
		if (!selectedUserForEdit || !editUserForm.password_hash.trim()) {
			alert("Wybierz użytkownika i wprowadź nowe hasło");
			return;
		}

		const success = await updateUserPassword(
			selectedUserForEdit.user_id,
			sha256(editUserForm.password_hash)
		);

		if (success) {
			setEditUserForm({ password_hash: "" });
			setSelectedUserForEdit(null);
		}
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

	// Dodaj useEffect, który odświeża listy studentów po zamknięciu modala edycji ról
	useEffect(() => {
		if (!isEditRolesModalOpen && subject) {
			fetchSubjectEnrolledUsers(subject.subject_id).then((users) => setApiSubjectEnrolledUsers(users));
			fetchSubjectNotEnrolledUsers(subject.subject_id).then((users) => setApiSubjectNotEnrolledUsers(users));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditRolesModalOpen]);

	// Funkcja do pobierania aktualnej roli edytującej
	const fetchCurrentEditorRole = async (subjectId: string): Promise<Role | null> => {
		const res = await fetch(`${baseApiUrl}/subjects/${subjectId}`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const data = await res.json();
			if (data.editor_role_id) {
				const editorRole = apiRoles.find(role => role.role_id === data.editor_role_id);
				return editorRole || null;
			}
		}
		return null;
	};

	// Funkcja do ustawienia roli jako edytującej
	const setRoleAsEditor = async (roleId: string) => {
		if (!subject) return;

		const res = await fetch(`${baseApiUrl}/subjects/${subject.subject_id}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				editor_role_id: roleId
			}),
		});

		if (res.ok) {
			// Odśwież role przedmiotu, aktualną rolę edytującą i listę wszystkich ról edytujących
			const [roles, editorRole] = await Promise.all([
				fetchSubjectRoles(subject.subject_id),
				fetchCurrentEditorRole(subject.subject_id),
				fetchAllSubjectsWithEditorRoles()
			]);
			setSubjectRoles(roles);
			setCurrentEditorRole(editorRole);
		} else {
			alert("Błąd ustawienia roli edytującej.");
		}
	};

	// Funkcja do usunięcia roli z przedmiotu i ustawienia jako edytującej
	const removeRoleAndSetAsEditor = async (roleId: string) => {
		if (!subject) return;

		// Najpierw usuń rolę z przedmiotu
		const removeRes = await fetch(`${baseApiUrl}/subjects/remove-role`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				subject_id: subject.subject_id,
				role_id: roleId
			}),
		});

		if (removeRes.ok) {
			// Następnie ustaw jako rolę edytującą
			await setRoleAsEditor(roleId);
		} else {
			alert("Błąd usuwania roli z przedmiotu.");
		}
	};

	// Funkcja do pobierania wszystkich przedmiotów i ich editor_role_id
	const fetchAllSubjectsWithEditorRoles = async () => {
		try {
			const res = await fetch(`${baseApiUrl}/subjects`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (res.ok) {
				const subjects = await res.json();
				const editorRoleIds = new Set<string>();
				
				// Dla każdego przedmiotu pobierz jego editor_role_id
				for (const subject of subjects) {
					const subjectRes = await fetch(`${baseApiUrl}/subjects/${subject.subject_id}`, {
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					});
					
					if (subjectRes.ok) {
						const subjectData = await subjectRes.json();
						if (subjectData.editor_role_id) {
							editorRoleIds.add(subjectData.editor_role_id);
						}
					}
				}
				
				setEditorRolesInSubjects(editorRoleIds);
			}
		} catch (error) {
			console.error("Błąd pobierania ról edytujących:", error);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", gap: "10px" }}>
				<button
					className={`${styles.button} ${styles.buttonPrimary}`}
					onClick={async () => {
						const users = await fetchAllUsers();
						setAllUsers(users);
						setIsEditUserModalOpen(true);
					}}
				>
					Edytuj użytkownika
				</button>
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
								Promise.all([
									fetchSubjectRoles(subject.subject_id),
									fetchCurrentEditorRole(subject.subject_id),
									fetchAllSubjectsWithEditorRoles()
								]).then(([roles, editorRole]) => {
									setSubjectRoles(roles);
									setCurrentEditorRole(editorRole);
									setIsEditRolesModalOpen(true);
								});
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
									onClick={async () => {
										if (subjectUser && subject) {
											// Fetch both user roles and subject roles
											const [allUserRoles, allSubjectRoles] = await Promise.all([
												fetchUserRoles(subjectUser.user_id),
												fetchSubjectRoles(subject.subject_id)
											]);
											
											// Calculate intersection: roles that user has AND are assigned to subject
											const userRolesForSubject = allUserRoles.filter(userRole =>
												allSubjectRoles.some(subjectRole => subjectRole.role_id === userRole.role_id)
											);
											
											setUserRoles(userRolesForSubject);
											setSubjectRoles(allSubjectRoles);
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
										<div className={styles.groupLocal} style={{ alignItems: "center", gap: 8 }}>
											{/* Pole z oceną po lewej */}
											<span
												className={styles.button}
												style={{ minWidth: 80, textAlign: "center", fontWeight: 500, pointerEvents: "none", cursor: "default", background: "#f5f5f5" }}
											>
												Ocena:{" "}
												{userSolutionGradeMap[assignment.assignment_id] !== undefined && userSolutionGradeMap[assignment.assignment_id] !== null
													? userSolutionGradeMap[assignment.assignment_id]
													: ""}
											</span>
											<button
												className={`${styles.button} ${styles.buttonPrimary}`}
												onClick={() => viewUserSolution(assignment.assignment_id)}
												disabled={
													!subjectUser ||
													!apiSubjectEnrolledUsers.some((u) => u.user_id === subjectUser.user_id) ||
													(userSolutionGradeMap[assignment.assignment_id] !== undefined && userSolutionGradeMap[assignment.assignment_id] !== null)
												}
											>
												Zobacz sprawozdanie wybranego studenta
											</button>
											<button
												className={`${styles.button} ${styles.buttonRed}`}
												onClick={() => deleteAssignmentFromSubject(assignment.assignment_id)}
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
											apiSubjectUserAssignmentSolution.grade || ""
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
											apiSubjectUserAssignmentSolution.review_comment || ""
										}
										className={styles.input}
										onChange={handleSolutionUpdate}
									/>
								</div>

								<button
									className={`${styles.button} ${styles.buttonPrimary}`}
									onClick={() => {
										if (!subjectUser) return;

										// Convert number array to Uint8Array for binary data
										const uint8Array = new Uint8Array(apiSubjectUserAssignmentSolution.solution_data);
										
										// Use the actual MIME type from the solution
										const mimeType = apiSubjectUserAssignmentSolution.mime_type || "application/octet-stream";
										
										// Determine file extension based on MIME type
										const getFileExtension = (mimeType: string): string => {
											const mimeToExt: { [key: string]: string } = {
												"application/zip": ".zip",
												"application/pdf": ".pdf",
												"text/plain": ".txt",
												"application/msword": ".doc",
												"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
												"application/vnd.ms-excel": ".xls",
												"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
												"image/jpeg": ".jpg",
												"image/png": ".png",
												"image/gif": ".gif",
												"text/html": ".html",
												"text/css": ".css",
												"application/javascript": ".js",
												"application/json": ".json",
												"text/xml": ".xml"
											};
											return mimeToExt[mimeType] || ".bin";
										};
										
										const fileExtension = getFileExtension(mimeType);
										const blob = new Blob([uint8Array], { type: mimeType });
										const url = window.URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = `sprawozdanie_${subjectUser.user_id}_${apiSubjectUserAssignmentSolution.solution_id}${fileExtension}`;
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
									disabled={
										!apiSubjectUserAssignmentSolution.grade && apiSubjectUserAssignmentSolution.grade !== 0
									}
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
							<div style={{ position: "relative", display: "flex", alignItems: "center" }}>
								<input
									type={isNewUserPasswordVisible ? "text" : "password"}
									id="password_hash"
									name="password_hash"
									value={newUser.password_hash}
									onChange={handleNewUserChange}
									className={styles.input}
									required
									style={{ flex: 1, paddingRight: "40px" }}
								/>
								<button
									type="button"
									onClick={() => setIsNewUserPasswordVisible(!isNewUserPasswordVisible)}
									style={{
										position: "absolute",
										right: "8px",
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: "4px",
										color: "#666"
									}}
									title={isNewUserPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
								>
									{isNewUserPasswordVisible ? "👁️" : "👁️‍🗨️"}
								</button>
							</div>
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
								onClick={() => {
									setIsNewUserModalOpen(false);
									setIsNewUserPasswordVisible(false);
								}}
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
											backgroundColor: currentEditorRole?.role_id === role.role_id ? "#e8f5e8" : "#f9f9f9"
										}}>
											<span>
												{role.name}
												{currentEditorRole?.role_id === role.role_id && " (Sprawdzanie sprawozdań)"}
											</span>
											<div style={{ display: "flex", gap: "8px" }}>
												<button
													className={`${styles.button} ${styles.buttonGreen}`}
													onClick={() => setRoleAsEditor(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
												>
													Przyznaj dostęp do sprawozdań
												</button>
												<button
													className={`${styles.button} ${styles.buttonRed}`}
													onClick={() => removeRoleFromSubject(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
													disabled={currentEditorRole?.role_id === role.role_id}
												>
													Usuń z przedmiotu
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Available Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Dostępne role przedmiotu (nieprzypisane do użytkownika)</h3>
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
												backgroundColor: editorRolesInSubjects.has(role.role_id) ? "#fff3cd" : "#fff3cd"
											}}>
												<span>
													{role.name}
													{editorRolesInSubjects.has(role.role_id) && " (Używana do dostępu do sprawozdań)"}
												</span>
												<button
													className={`${styles.button} ${styles.buttonRed}`}
													onClick={() => deleteGlobalRole(role.role_id)}
													style={{ padding: "4px 8px", fontSize: "12px" }}
													disabled={editorRolesInSubjects.has(role.role_id)}
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
					<h2>Zarządzanie rolami użytkownika dla przedmiotu</h2>

					<div className={styles.modalContent} style={{ maxHeight: "80vh", overflowY: "auto" }}>
						{subjectUser && subject && (
							<div style={{ marginBottom: "20px" }}>
								<p><strong>Użytkownik:</strong> {subjectUser.name} {subjectUser.surname} ({subjectUser.email})</p>
								<p><strong>Przedmiot:</strong> {subject.subject_name}</p>
							</div>
						)}

						{/* User Roles Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Role przypisane do użytkownika dla tego przedmiotu</h3>
							{userRoles.length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Brak ról przypisanych do tego użytkownika dla tego przedmiotu.
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
							<h3>Dostępne role przedmiotu (nieprzypisane do użytkownika)</h3>
							{subjectRoles.filter(role => !userRoles.some(userRole => userRole.role_id === role.role_id)).length === 0 ? (
								<p style={{ fontStyle: "italic", color: "#666" }}>
									Użytkownik ma już wszystkie dostępne role dla tego przedmiotu.
								</p>
							) : (
								<div>
									{subjectRoles
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

			{isEditUserModalOpen && (
				<Modal onClose={() => setIsEditUserModalOpen(false)}>
					<h2>Edytuj użytkownika</h2>

					<div className={styles.modalContent} style={{ maxHeight: "80vh", overflowY: "auto" }}>
						{/* User Selection Section */}
						<div style={{ marginBottom: "30px" }}>
							<h3>Wybierz użytkownika</h3>
							<input
								type="text"
								placeholder="Wyszukaj użytkownika..."
								value={editUserSearchTerm}
								onChange={(e) => setEditUserSearchTerm(e.target.value)}
								className={styles.input}
								style={{ marginBottom: "15px" }}
							/>

							<div style={{ 
								maxHeight: "300px", 
								overflowY: "auto", 
								border: "1px solid #ddd", 
								borderRadius: "4px",
								backgroundColor: "#f9f9f9"
							}}>
								{filterAllUsers(allUsers, editUserSearchTerm).map((user) => (
									<div
										key={user.user_id}
										onClick={() => setSelectedUserForEdit(user)}
										style={{
											padding: "12px",
											cursor: "pointer",
											borderBottom: "1px solid #eee",
											backgroundColor: selectedUserForEdit?.user_id === user.user_id ? "#e3f2fd" : "white",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center"
										}}
										onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedUserForEdit?.user_id === user.user_id ? "#e3f2fd" : "#f5f5f5"}
										onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedUserForEdit?.user_id === user.user_id ? "#e3f2fd" : "white"}
									>
										<div>
											<div style={{ fontWeight: "bold" }}>
												{user.name} {user.surname}
											</div>
											<div style={{ fontSize: "14px", color: "#666" }}>
												{user.email}
											</div>
											{user.student_id && (
												<div style={{ fontSize: "12px", color: "#888" }}>
													ID: {user.student_id}
												</div>
											)}
											{user.is_admin && (
												<div style={{ fontSize: "12px", color: "#d32f2f", fontWeight: "bold" }}>
													Administrator
												</div>
											)}
										</div>
										{selectedUserForEdit?.user_id === user.user_id && (
											<span style={{ color: "#1976d2", fontSize: "18px" }}>✓</span>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Password Change Section */}
						{selectedUserForEdit && (
							<div style={{ marginBottom: "30px" }}>
								<h3>Zmień hasło dla: {selectedUserForEdit.name} {selectedUserForEdit.surname}</h3>
								<div>
									<label htmlFor="edit_password_hash">Nowe hasło:</label>
									<div style={{ position: "relative", display: "flex", alignItems: "center" }}>
										<input
											type={isPasswordVisible ? "text" : "password"}
											id="edit_password_hash"
											name="password_hash"
											value={editUserForm.password_hash}
											onChange={handleEditUserChange}
											className={styles.input}
											placeholder="Wprowadź nowe hasło"
											style={{ flex: 1, paddingRight: "40px" }}
										/>
										<button
											type="button"
											onClick={() => setIsPasswordVisible(!isPasswordVisible)}
											style={{
												position: "absolute",
												right: "8px",
												background: "none",
												border: "none",
												cursor: "pointer",
												padding: "4px",
												color: "#666"
											}}
											title={isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
										>
											{isPasswordVisible ? "👁️" : "👁️‍🗨️"}
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
							{selectedUserForEdit && (
								<button
									className={`${styles.button} ${styles.buttonGreen}`}
									onClick={handleEditUserPassword}
									disabled={!editUserForm.password_hash.trim()}
								>
									Zmień hasło
								</button>
							)}
							<button
								className={`${styles.button} ${styles.buttonPrimary}`}
								onClick={() => {
									setIsEditUserModalOpen(false);
									setSelectedUserForEdit(null);
									setEditUserForm({ password_hash: "" });
									setEditUserSearchTerm("");
									setIsPasswordVisible(false);
								}}
							>
								Wyjdź
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
