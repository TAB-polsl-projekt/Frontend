use chrono::Utc;
use diesel::dsl::exists;
use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::post;
use rocket::serde::uuid::Uuid;
use rocket::serde::json::Json;
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};
use rocket_okapi::okapi::schemars;
use serde::{Deserialize, Serialize};
use rocket::response::status::BadRequest;
use crate::session::Session;

use crate::dbmodels::Solution;
use crate::dbschema::{assignments, solution, subjects, user_subjects};

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

#[derive(Serialize, Deserialize, Debug, schemars::JsonSchema)]
#[serde(untagged)]
pub enum Error {
    Other(String)
    
}

#[openapi(tag = "Assignments", operation_id = "postAssignmetSolution")]
#[post("/assignments/<assignment_id>/solution", data = "<sln>")]
pub async fn endpoint(assignment_id: String, sln: Json<Solution>, conn: crate::db::DbConn, session: Session) -> Result<(), BadRequest<Json<Error>>> {
    let mut sln = sln.0;
    let user_id = session.user_id;

    conn.run(move |c| -> Result<_, Error> {

        let query = assignments::table
            .inner_join(subjects::table.on(subjects::subject_id.eq(assignments::subject_id)))
            .inner_join(user_subjects::table.on(user_subjects::subject_id.eq(subjects::subject_id)))
            .filter(user_subjects::user_id.eq(user_id))
            .filter(assignments::assignment_id.eq(assignment_id));

        let user_has_access_to_assignments: bool = diesel::select(exists(query))
            .get_result(c)
            .map_err(|_e_| Error::Other("".to_string()))?;

        if !user_has_access_to_assignments {
            return Err(Error::Other("User does not have access to the assignment".to_string()));
        }

        sln.solution_id = Uuid::new_v4().to_string();
        sln.submission_date = Some(Utc::now().naive_utc());

        let _result = diesel::insert_into(solution::table)
            .values(sln)
            .execute(c)
            .map_err(|_e| Error::Other("".to_string()))?;

        Ok(())
    })
    .await
    .map_err(|e| BadRequest(Json(e)))
}