use diesel::dsl::exists;
use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::{post, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::Assignment;
use crate::dbschema::{assignments, roles, user_subjects};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "", String, ()),
});

define_api_response!(pub enum Error {
    Unauthorized => (401, "User is not an admin", String, ()),
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Assignments", operation_id = "postAssignment")]
#[post("/assignments", data = "<assignment>")]
pub async fn endpoint(assignment: Json<Assignment>, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let assignment = assignment.0;
    let is_admin = session.is_admin;

    if !is_admin {
        return Err(Error::Unauthorized("".to_owned()));
    }

    let _result = conn.run(move |c| {
        diesel::insert_into(assignments::table)
            .values(assignment)
            .execute(c)
    }).await?;

    Ok(Response::Ok("".to_owned()))
}