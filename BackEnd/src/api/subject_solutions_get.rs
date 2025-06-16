use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::{Solution};
use crate::dbschema::{assignments, solution, subjects, user_solution_assignments};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "TEST", Vec<Solution>, ()),
});

define_api_response!(pub enum Error {
    InternalServerError => (401, "TEST", (), (diesel::result::Error)),
});

#[openapi(tag = "Subjects", operation_id = "aaa")]
#[get("/subject/<subject_id>/solutions")]
pub async fn endpoint(subject_id: String, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    if !session.is_admin {
        return Err(Error::InternalServerError(()));
    }

    let result = conn.run(move |c| {
        subjects::table
            .inner_join(assignments::table.on(assignments::subject_id.eq(subject_id)))
            .inner_join(user_solution_assignments::table.on(user_solution_assignments::assignment_id.eq(assignments::assignment_id)))
            .inner_join(solution::table.on(user_solution_assignments::solution_id.eq(solution::solution_id)))
            .select(solution::all_columns)
            .get_results(c)
    }).await?;

    Ok(Response::Ok(result))
}