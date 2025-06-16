use diesel::dsl::exists;
use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::{put, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use rocket_okapi::okapi::schemars;
use serde::{Deserialize, Serialize};
use rocket::response::status::BadRequest;

use crate::dbmodels::AssignmentUpdate;
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

#[openapi(tag = "Account")]
#[put("/assignments/<assignment_id>", data = "<assignment_update>")]
pub async fn endpoint(
    assignment_id: String,
    assignment_update: Json<AssignmentUpdate>,
    conn: crate::db::DbConn, session: Session
) -> Result<(), BadRequest<Json<Error>>> {
    let assignment_update = assignment_update.0;
    let user_id = session.user_id;

    conn.run(move |c| -> Result<_, Error> {

        let is_user_editor_query = assignments::table
            .inner_join(subjects::table.on(subjects::subject_id.eq(assignments::subject_id)))
            .inner_join(user_subjects::table.on(user_subjects::role_id.eq(subjects::editor_role_id)))
            .filter(user_subjects::user_id.eq(user_id))
            .filter(assignments::assignment_id.eq(&assignment_id));

        let is_user_editor: bool = diesel::select(exists(is_user_editor_query))
            .get_result(c)
            .map_err(|_err| Error::Other("".to_string()))?;

        if !is_user_editor {
            return Err(Error::Other("User is not editor".to_string()));
        }

        let _rows_affected = diesel::update(
            assignments::table.filter(assignments::assignment_id.eq(&assignment_id))
        ).set(&assignment_update)
        .execute(c)
        .map_err(|_err| Error::Other("".to_string()))?;

        Ok(())
    })
    .await
    .map_err(|e| BadRequest(Json(e)))
}