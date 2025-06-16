use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use rocket::{put, serde::json::Json};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_routes_spec, settings::OpenApiSettings};

use crate::define_api_response;
use crate::session::Session;
use crate::{dbmodels::UserUpdate, dbschema::users};

pub fn get_routes_and_docs(settings: &OpenApiSettings) -> (Vec<rocket::Route>, OpenApi) {
    openapi_get_routes_spec![settings: endpoint]
}

define_api_response!(pub enum Error {
    InternalServerError => (500, "TEST", String, (diesel::result::Error)),
});

#[openapi(tag = "Account", operation_id = "putAccountInfo")]
#[put("/account", data = "<user>")]
pub async fn endpoint(user: Json<UserUpdate>, conn: crate::db::DbConn, session: Session) -> Result<(), Error> {
    let user_id = session.user_id;
    let update_user = user.0;
    
    conn.run(move |c| -> Result<_, Error> {

        let _rows_affected = diesel::update(users::table.filter(users::user_id.eq(user_id)))
            .set(&update_user)
            .execute(c)?;

        Ok(())
    }).await
}