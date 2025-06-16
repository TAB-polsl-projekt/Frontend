use diesel::result::Error::NotFound;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::{get, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::User;
use crate::dbschema::users;
use crate::{define_api_response};
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "TEST", User, ()),
});

define_api_response!(pub enum Error {
    NotFound => (404, "User not found", String, ()),
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

/// Test
#[openapi(tag = "Account", operation_id = "getAccountInfo")]
#[get("/account")]
pub async fn endpoint(conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let user_id = session.user_id;

    let result = conn.run(move |c| {
        users::table
            .filter(users::user_id.eq(user_id))
            .select(users::all_columns)
            .first(c)
    }).await;

    let user = result.map_err(|e| {
        if let NotFound = e {
            Error::NotFound("".to_owned())
        } else {
            e.into()
        }
    })?;

    Ok(Response::Ok(user))
}