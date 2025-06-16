use chrono::{DateTime, NaiveDateTime};
use diesel::{prelude::{Insertable, Queryable}, AsChangeset};
use schemars::JsonSchema;
use serde::{Serialize};

use crate::dbschema::{assignments, roles, solution, subjects, user_subjects, users};

use serde::{Deserialize, Deserializer};

pub fn from_timestamp<'de, D>(deserializer: D) -> Result<NaiveDateTime, D::Error>
where
    D: Deserializer<'de>,
{
    let timestamp = i64::deserialize(deserializer)?;
    let datetime = DateTime::from_timestamp(timestamp, 0)
        .ok_or_else(|| serde::de::Error::custom("invalid timestamp"))?;
    
    Ok(datetime.naive_utc())
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema)]
#[diesel(table_name = users)]
pub struct User {
    pub user_id: String,
    pub email: String,
    pub name: String,
    pub surname: String,
    pub student_id: Option<String>,
    pub user_disabled: bool,
    pub last_login_time: Option<NaiveDateTime>,
    pub is_admin: bool
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, AsChangeset)]
#[diesel(table_name = users)]
pub struct UserUpdate {
    pub email: Option<String>,
    pub name: Option<String>,
    pub surname: Option<String>,
    pub student_id: Option<String>,
    pub user_disabled: Option<bool>,
    pub last_login_time: Option<NaiveDateTime>
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, Insertable)]
#[diesel(table_name = assignments)]
pub struct Assignment {
    pub assignment_id: String,
    pub subject_id: String,
    pub title: String,
    pub description: Option<String>,
    pub accepted_mime_types: Option<String>
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, AsChangeset)]
#[diesel(table_name = assignments)]
pub struct AssignmentUpdate {
    pub title: Option<String>,
    pub description: Option<String>
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, Insertable)]
#[diesel(table_name = subjects)]
pub struct Subject {
    pub subject_id: String,
    pub subject_name: Option<String>,
    pub editor_role_id: String
}

#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, AsChangeset)]
#[diesel(table_name = subjects)]
pub struct SubjectUpdate {
    pub subject_name: Option<String>,
    pub editor_role_id: Option<String>
}


#[derive(Debug, Queryable, Serialize, Deserialize, JsonSchema, Insertable)]
#[serde(crate = "rocket::serde")]
#[diesel(table_name = solution)]
pub struct Solution {
    pub solution_id: String,
    #[serde(skip)]
    pub grade: Option<f64>,
    #[serde(deserialize_with = "from_timestamp")]
    #[serde(skip)]
    pub submission_date: Option<NaiveDateTime>,
    #[serde(serialize_with = "serde_bytes::serialize")]
    #[serde(deserialize_with = "serde_bytes::deserialize")]
    pub solution_data: Option<Vec<u8>>,
    #[serde(skip)]
    pub reviewed_by: Option<String>,
    #[serde(skip)]
    pub review_comment: Option<String>,
    #[serde(deserialize_with = "from_timestamp")]
    #[serde(skip)]
    pub review_date: Option<NaiveDateTime>,
    pub mime_type: Option<String>
}

#[derive(Debug, Queryable, Serialize, Deserialize)]
#[diesel(table_name = session_refresh_keys)]
pub struct SessionRefreshKeys {
    pub refresh_key_id: String,
    pub user_id: String,
    pub expiration_time: NaiveDateTime,
    pub refresh_count: i32,
    pub refresh_limit: i32,
}

#[derive(Debug, Queryable, Serialize, Deserialize, Insertable, JsonSchema)]
#[diesel(table_name = roles)]
pub struct Role {
    pub role_id: String,
    pub name: String,
    pub permissions: i32
}

#[derive(Debug, Queryable, Serialize, Deserialize, Insertable, JsonSchema)]
#[diesel(table_name = user_subjects)]
pub struct UserSubjects {
    pub user_id: String,
    pub subject_id: String,
    pub role_id: String,
    pub grade: Option<f64>
}