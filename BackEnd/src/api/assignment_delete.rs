use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::{delete, post};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use rocket_okapi::okapi::schemars;
use serde::{Deserialize, Serialize};
use rocket::response::status::BadRequest;
use diesel::prelude::*;
use uuid::Uuid;

use crate::dbmodels::Subject;
use crate::dbschema::{assignments, subjects, user_subjects};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "", (), ()),
});

define_api_response!(pub enum Error {
    Unauthorized => (401, "User is not an admin", (), ()),
    InternalServerError => (500, "TEST", (), (diesel::result::Error)),
});

#[openapi(tag = "Assignments", operation_id = "deleteAssignment")]
#[delete("/assignments/<assignment_id>")]
pub async fn endpoint(assignment_id: String, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    if !session.is_admin {
        return Err(Error::Unauthorized(()));
    }

    let _result = conn.run(move |c| {
        diesel::delete(assignments::table)
            .filter(assignments::assignment_id.eq(assignment_id))
            .execute(c)
    })
    .await?;

    Ok(Response::Ok(()))
}