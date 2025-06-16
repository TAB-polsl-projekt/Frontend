use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use rocket_okapi::okapi::schemars;
use serde::{Deserialize, Serialize};
use rocket::response::status::BadRequest;
use diesel::prelude::*;

use crate::dbmodels::Assignment;
use crate::dbschema::{assignments, subjects, user_subjects};
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

#[derive(Serialize, Deserialize, Debug, schemars::JsonSchema)]
#[serde(untagged)]
pub enum Error {
    Other(String)
    
}

#[derive(Debug, schemars::JsonSchema, Serialize, Deserialize)]
pub struct Response {
    subject_name: String,
    assignments: Vec<Assignment>,
}

#[openapi(tag = "Subjects", operation_id = "getSubject")]
#[get("/subjects/<subject_id>")]
pub async fn endpoint(subject_id: String, conn: crate::db::DbConn, session: Session) -> Result<Json<Response>, BadRequest<Json<Error>>> {
    let user_id = session.user_id;

    conn.run(move |c| -> Result<_, Error> {

        let assignments: Vec<_> = {
            subjects::table
                .inner_join(user_subjects::table.on(user_subjects::subject_id.eq(subjects::subject_id)))
                .inner_join(assignments::table.on(subjects::subject_id.eq(assignments::subject_id)))
                .filter(user_subjects::user_id.eq(user_id))
                .filter(subjects::subject_id.eq(subject_id))
                .select(assignments::all_columns)
                .get_results(c)
                .map_err(|_e| Error::Other("".to_string()))?
        };

        Ok(Json(Response { subject_name: "".to_string(), assignments }))
    })
    .await
    .map_err(|e| BadRequest(Json(e)))
}