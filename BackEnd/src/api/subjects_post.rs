use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::post;
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use rocket_okapi::okapi::schemars;
use serde::{Deserialize, Serialize};
use rocket::response::status::BadRequest;
use diesel::prelude::*;
use uuid::Uuid;

use crate::dbmodels::Subject;
use crate::dbschema::{subjects, user_subjects};
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

#[openapi(tag = "Subjects", operation_id = "postSubjects")]
#[post("/subjects", data = "<subject>")]
pub async fn endpoint(subject: Json<Subject>, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let mut subject = subject.0;

    if !session.is_admin {
        return Err(Error::Unauthorized(()));
    }

    subject.subject_id = Uuid::new_v4().to_string();

    let _result = conn.run(move |c| {
        diesel::insert_into(subjects::table)
            .values(subject)
            .execute(c)
    })
    .await?;

    Ok(Response::Ok(()))
}