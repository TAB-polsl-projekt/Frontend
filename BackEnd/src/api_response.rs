/// Macro to define an API response enum with Rocket Responder and OpenAPI support.
#[macro_export]
macro_rules! define_api_response {
    (
        $(#[$enum_meta:meta])*
        $vis:vis enum $name:ident {
            $(
                // each tuple: (HTTP code, description, body‐wrapper type)
                $variant:ident => ($code:literal, $desc:expr, $body:ty, ($($FromTy:path),*))
            ),* $(,)?
        }
    ) => {
        $(#[$enum_meta])*
        $vis enum $name {
            $(
                /// Variant for HTTP status $code
                $variant($body),
            )*
        }

        $(
            $(
                impl From<$FromTy> for $name {
                    fn from(_from: $FromTy) -> Self {
                        // we assume payload is Default; for `()` this just yields `()`
                        $name::$variant(Default::default())
                    }
                }
            )*
        )*

        // Implement Rocket's Responder
        impl<'r> ::rocket::response::Responder<'r, 'static> for $name {
            fn respond_to(self, _req: &'r ::rocket::request::Request<'_>) -> ::rocket::response::Result<'static> {
                match self {
                    $(
                        $name::$variant(body) => {
                            let body = Json(body);
                            ::rocket::response::Response::build_from(body.respond_to(_req)?)
                                .status(::rocket::http::Status::new($code))
                                .ok()
                        }
                    )*
                }
            }
        }

        // Implement OpenAPI support
        impl rocket_okapi::response::OpenApiResponderInner for $name {
            fn responses(
                _gen: &mut ::rocket_okapi::r#gen::OpenApiGenerator
            ) -> rocket_okapi::Result<::rocket_okapi::okapi::openapi3::Responses> {
                #[allow(unused_mut)]
                let mut responses = ::rocket_okapi::okapi::openapi3::Responses::default();
                $(
                    // Extract the inner type from the wrapper
                    //type Inner = <$body as rocket_okapi::response::OpenApiResponder>::Inner;
                    let schema = _gen.json_schema::<$body>();
                    let mut content: ::rocket_okapi::okapi::schemars::Map<String, ::rocket_okapi::okapi::openapi3::MediaType> = Default::default();
                    content.insert(
                        "application/json".to_owned(),
                        ::rocket_okapi::okapi::openapi3::MediaType {
                            schema: schema.into(),
                            example: None,
                            examples: None,
                            extensions: Default::default(),
                            encoding: Default::default(),
                        },
                    );
                    responses.responses.insert(
                        $code.to_string(),
                        okapi::openapi3::RefOr::Object(::rocket_okapi::okapi::openapi3::Response {
                            description: $desc.to_string(),
                            content,
                            ..Default::default()
                        }),
                    );
                )*
                Ok(responses)
            }
        }
    };
}
