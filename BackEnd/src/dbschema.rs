// @generated automatically by Diesel CLI.

diesel::table! {
    assignments (assignment_id) {
        assignment_id -> Text,
        subject_id -> Text,
        title -> Text,
        description -> Nullable<Text>,
        accepted_mime_types -> Nullable<Text>,
    }
}

diesel::table! {
    microsoft_logins (microsoft_login_id) {
        microsoft_login_id -> Text,
        microsoft_id -> Text,
        user_id -> Text,
    }
}

diesel::table! {
    roles (role_id) {
        role_id -> Text,
        name -> Text,
        permissions -> Integer,
    }
}

diesel::table! {
    session_refresh_keys (refresh_key_id) {
        refresh_key_id -> Text,
        user_id -> Text,
        expiration_time -> Timestamp,
        refresh_count -> Integer,
        refresh_limit -> Integer,
    }
}

diesel::table! {
    solution (solution_id) {
        solution_id -> Text,
        grade -> Nullable<Double>,
        submission_date -> Nullable<Timestamp>,
        solution_data -> Nullable<Binary>,
        reviewed_by -> Nullable<Text>,
        review_comment -> Nullable<Text>,
        review_date -> Nullable<Timestamp>,
        mime_type -> Nullable<Text>,
    }
}

diesel::table! {
    subjects (subject_id) {
        subject_id -> Text,
        subject_name -> Nullable<Text>,
        editor_role_id -> Text,
    }
}

diesel::table! {
    user_solution_assignments (user_id, solution_id, assignment_id) {
        user_id -> Text,
        solution_id -> Text,
        assignment_id -> Text,
    }
}

diesel::table! {
    user_subjects (user_id, subject_id) {
        user_id -> Text,
        subject_id -> Text,
        role_id -> Text,
        grade -> Nullable<Double>,
    }
}

diesel::table! {
    users (user_id) {
        user_id -> Text,
        email -> Text,
        name -> Text,
        surname -> Text,
        student_id -> Nullable<Text>,
        user_disabled -> Bool,
        last_login_time -> Nullable<Timestamp>,
        is_admin -> Bool,
    }
}

diesel::joinable!(assignments -> subjects (subject_id));
diesel::joinable!(microsoft_logins -> users (user_id));
diesel::joinable!(session_refresh_keys -> users (user_id));
diesel::joinable!(solution -> users (reviewed_by));
diesel::joinable!(subjects -> roles (editor_role_id));
diesel::joinable!(user_solution_assignments -> assignments (assignment_id));
diesel::joinable!(user_solution_assignments -> solution (solution_id));
diesel::joinable!(user_solution_assignments -> users (user_id));
diesel::joinable!(user_subjects -> roles (role_id));
diesel::joinable!(user_subjects -> subjects (subject_id));
diesel::joinable!(user_subjects -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    assignments,
    microsoft_logins,
    roles,
    session_refresh_keys,
    solution,
    subjects,
    user_solution_assignments,
    user_subjects,
    users,
);
