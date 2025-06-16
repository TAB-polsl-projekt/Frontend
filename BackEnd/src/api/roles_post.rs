use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::post;
use rocket::{put, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::dbmodels::Role;
use crate::dbschema::roles;
use crate::define_api_response;
use crate::session::Session;

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Response {
    Ok => (200, "OK", (), ()),
});

define_api_response!(pub enum Error {
    Unauthorized => (401, "User is not admin", (), ()),
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Roles", operation_id = "postRole")]
#[post("/roles", data = "<role>")]
pub async fn endpoint(role: Json<Role>, conn: crate::db::DbConn, session: Session) -> Result<Response, Error> {
    let role = role.0;

    if !session.is_admin {
        return Err(Error::Unauthorized(()));
    }
    
    let _ = conn.run(move |c|{
        diesel::insert_into(roles::table)
            .values(role)
            .execute(c)
    }).await?;

    Ok(Response::Ok(()))
}