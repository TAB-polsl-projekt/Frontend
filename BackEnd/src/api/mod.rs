use rocket::Route;
use rocket_okapi::{okapi::{merge::marge_spec_list, openapi3::OpenApi}, settings::OpenApiSettings};

pub mod account_get;
pub mod account_put;
pub mod assignment_get;
pub mod assignment_put;
pub mod assignment_solution_get;
pub mod assignment_solution_post;
pub mod assignments_post;
pub mod auth_delete;
pub mod auth_post;
pub mod subject_get;
pub mod subject_put;
pub mod subjects_get;
pub mod subjects_post;
pub mod users_get;
pub mod assignments_get;
pub mod get_solutions;
pub mod subjects_delete;
pub mod assignment_delete;
pub mod roles_post;
pub mod subject_role_post;
pub mod subject_role_delete;
pub mod subject_student_assignments_get;
pub mod subject_solutions_get;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<Route>, OpenApi) {
    // Start with an empty vector for routes and an initial empty OpenAPI object.
    let mut all_routes_and_docs = Vec::new();
    let prefix = "".to_string();

    all_routes_and_docs.push(assignment_solution_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(account_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(account_put::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_put::get_routes_and_docs(settings));
    all_routes_and_docs.push(subjects_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignment_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignment_solution_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignments_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignment_put::get_routes_and_docs(settings));
    all_routes_and_docs.push(auth_delete::get_routes_and_docs(settings));
    all_routes_and_docs.push(auth_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(users_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignments_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(get_solutions::get_routes_and_docs(settings));
    all_routes_and_docs.push(subjects_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(subjects_delete::get_routes_and_docs(settings));
    all_routes_and_docs.push(assignment_delete::get_routes_and_docs(settings));
    all_routes_and_docs.push(roles_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_role_post::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_role_delete::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_solutions_get::get_routes_and_docs(settings));
    all_routes_and_docs.push(subject_student_assignments_get::get_routes_and_docs(settings));

    let (all_routes, all_spec) = all_routes_and_docs.into_iter()
        .fold((Vec::new(), Vec::new()), |(mut routes, mut specs), it| {
            routes.extend(it.0); specs.push(it.1); (routes, specs)
        });

    let spec_list: Vec<(&String, OpenApi)> = all_spec.into_iter().map(|x| (&prefix, x)).collect();
    let merged_spec = marge_spec_list(&spec_list).unwrap();

    (all_routes, merged_spec)
}
