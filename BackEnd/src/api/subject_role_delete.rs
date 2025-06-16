use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::{delete, post};
use rocket::{put, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::dbmodels::{Role, UserSubjects};
use crate::dbschema::{roles, user_subjects};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct RequestData {
    pub role_id: String,
    pub user_id: String,
    pub subject_id: String,
}

define_api_response!(pub enum Response {
    Ok => (200, "OK", (), ()),
});

define_api_response!(pub enum Error {
    Unauthorized => (401, "User is not admin", (), ()),
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Subjects", operation_id = "deleteSubjectRole")]
#[delete("/subjects/add-role", data = "<data>")]
pub async fn endpoint(data: Json<RequestData>, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let data = data.0;
    
    if !session.is_admin {
        return Err(Error::Unauthorized(()));
    }

    let user_id = data.user_id;
    let role_id = data.role_id;
    let subject_id = data.subject_id;
    
    let _ = conn.run(move |c|{
        diesel::delete(user_subjects::table)
            .filter(user_subjects::subject_id.eq(subject_id))
            .filter(user_subjects::user_id.eq(user_id))
            .filter(user_subjects::role_id.eq(role_id))
            .execute(c)
    }).await?;

    Ok(Response::Ok(()))
}