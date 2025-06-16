use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::{Solution};
use crate::dbschema::{assignments, solution, user_solution_assignments};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "TEST", Solution, ()),
});

define_api_response!(pub enum Error {
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Assignments", operation_id = "getAssignmentSolution")]
#[get("/assignments/<assignment_id>/solution")]
pub async fn endpoint(assignment_id: String, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let user_id = session.user_id;

    let result = conn.run(move |c| {
        assignments::table
            .inner_join(user_solution_assignments::table.on(user_solution_assignments::assignment_id.eq(assignments::assignment_id)))
            .inner_join(solution::table.on(solution::solution_id.eq(user_solution_assignments::solution_id)))
            .filter(user_solution_assignments::user_id.eq(user_id))
            .filter(assignments::assignment_id.eq(assignment_id))
            .order(solution::submission_date.desc())
            .select(solution::all_columns)
            .first(c)
    }).await?;

    Ok(Response::Ok(result))
}