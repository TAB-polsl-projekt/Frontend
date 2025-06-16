use diesel::{r2d2::{ConnectionManager, Pool}, sqlite::SqliteConnection};
use rocket_okapi::{r#gen::OpenApiGenerator, request::{OpenApiFromRequest, RequestHeaderInput}};
use rocket_sync_db_pools::database;

#[database("sqlite_db")]
pub struct DbConn(SqliteConnection);
pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

impl<'r> OpenApiFromRequest<'r> for DbConn {
    fn from_request_input(
        _gen: &mut OpenApiGenerator,
        _name: String,
        _required: bool,
    ) -> rocket_okapi::Result<RequestHeaderInput> {
        Ok(RequestHeaderInput::None)
    }
}