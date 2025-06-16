use diesel::{ExpressionMethods, JoinOnDsl, QueryDsl, RunQueryDsl};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::Assignment;
use crate::dbschema::{assignments, user_solution_assignments};
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "TEST", Assignment, ()),
});

define_api_response!(pub enum Error {
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Account")]
#[get("/assignments/<assignment_id>")]
pub async fn endpoint(assignment_id: String, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let user_id = session.user_id;
    
    let result = conn.run(move |c| {
        assignments::table
            .inner_join(user_solution_assignments::table.on(user_solution_assignments::assignment_id.eq(assignments::assignment_id)))
            .filter(user_solution_assignments::user_id.eq(user_id))
            .filter(assignments::assignment_id.eq(assignment_id))
            .select(assignments::all_columns)
            .first(c)
    }).await?;

    Ok(Response::Ok(result))
}