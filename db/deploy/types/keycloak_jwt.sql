-- Deploy ccbc:types/keycloak_jwt to pg
-- requires: schemas/public

begin;

create type ccbc_public.keycloak_jwt as (
  jti uuid,
  exp integer,
  nbf integer,
  iat integer,
  iss text,
  aud text,
  sub varchar(1000),
  typ text,
  azp text,
  auth_time integer,
  session_state uuid,
  acr text,
  email_verified boolean,
  name text,
  preferred_username text,
  given_name text,
  family_name text,
  email text,
  broker_session_id text,
  priority_group text,
  identity_provider text,
  user_groups text[]
);

comment on column ccbc_public.keycloak_jwt.jti is
  'OPTIONAL - The "jti" (JWT ID) claim provides a unique identifier for the JWT.
   The identifier value MUST be assigned in a manner that ensures that
   there is a negligible probability that the same value will be
   accidentally assigned to a different data object; if the application
   uses multiple issuers, collisions MUST be prevented among values
   produced by different issuers as well.  The "jti" claim can be used
   to prevent the JWT from being replayed.  The "jti" value is a case-
   sensitive string.';
comment on column ccbc_public.keycloak_jwt.exp is
  'REQUIRED - The "exp" (expiration time) claim identifies the expiration time on
   or after which the JWT MUST NOT be accepted for processing.  The
   processing of the "exp" claim requires that the current date/time
   MUST be before the expiration date/time listed in the "exp" claim.';
comment on column ccbc_public.keycloak_jwt.nbf is
  'OPTIONAL - The "nbf" (not before) claim identifies the time before which the JWT
   MUST NOT be accepted for processing.  The processing of the "nbf"
   claim requires that the current date/time MUST be after or equal to
   the not-before date/time listed in the "nbf" claim.  Implementers MAY
   provide for some small leeway, usually no more than a few minutes, to
   account for clock skew.  Its value MUST be a number containing a
   NumericDate value.';
comment on column ccbc_public.keycloak_jwt.iat is
  'REQUIRED - The "iat" (issued at) claim identifies the time at which the JWT was
   issued.  This claim can be used to determine the age of the JWT.  Its
   value MUST be a number containing a NumericDate value.';
comment on column ccbc_public.keycloak_jwt.iss is 
  'REQUIRED - The "iss" (issuer) claim identifies the principal that issued the
   JWT.  The processing of this claim is generally application specific.
   The "iss" value is a case-sensitive string containing a StringOrURI
   value.';
comment on column ccbc_public.keycloak_jwt.aud is
  'REQUIRED - The "aud" (audience) claim identifies the recipients that the JWT is
   intended for.  Each principal intended to process the JWT MUST
   identify itself with a value in the audience claim.  If the principal
   processing the claim does not identify itself with a value in the
   "aud" claim when this claim is present, then the JWT MUST be
   rejected.  In the general case, the "aud" value is an array of case-
   sensitive strings, each containing a StringOrURI value.  In the
   special case when the JWT has one audience, the "aud" value MAY be a
   single case-sensitive string containing a StringOrURI value.  The
   interpretation of audience values is generally application specific.';
comment on column ccbc_public.keycloak_jwt.sub is
  'REQUIRED - The "sub" (subject) claim identifies the principal that is the
   subject of the JWT.  The claims in a JWT are normally statements
   about the subject.  The subject value MUST either be scoped to be
   locally unique in the context of the issuer or be globally unique.
   The processing of this claim is generally application specific.  The
   "sub" value is a case-sensitive string containing a StringOrURI
   value.';
comment on column ccbc_public.keycloak_jwt.typ is
  'OPTIONAL - The "typ" (type) Header Parameter defined by [JWS] and [JWE] is used
   by JWT applications to declare the media type [IANA.MediaTypes] of
   this complete JWT.  This is intended for use by the JWT application
   when values that are not JWTs could also be present in an application
   data structure that can contain a JWT object; the application can use
   this value to disambiguate among the different kinds of objects that
   might be present.  It will typically not be used by applications when
   it is already known that the object is a JWT.  This parameter is
   ignored by JWT implementations; any processing of this parameter is
   performed by the JWT application.  If present, it is RECOMMENDED that
   its value be "JWT" to indicate that this object is a JWT.  While
   media type names are not case sensitive, it is RECOMMENDED that "JWT"
   always be spelled using uppercase characters for compatibility with
   legacy implementations.';
comment on column ccbc_public.keycloak_jwt.azp is
  'OPTIONAL - Authorized party - the party to which the ID Token was issued. If 
  present, it MUST contain the OAuth 2.0 Client ID of this party. This 
  Claim is only needed when the ID Token has a single audience value and 
  that audience is different than the authorized party. It MAY be included 
  even when the authorized party is the same as the sole audience. The azp
  value is a case sensitive string containing a StringOrURI value.';
comment on column ccbc_public.keycloak_jwt.auth_time is
  'Time when the End-User authentication occurred. Its value is a JSON number
   representing the number of seconds from 1970-01-01T0:0:0Z as measured 
   in UTC until the date/time. When a max_age request is made or when auth_time 
   is requested as an Essential Claim, then this Claim is REQUIRED; otherwise, 
   its inclusion is OPTIONAL';
comment on column ccbc_public.keycloak_jwt.session_state is
  'Session State. JSON string that represents the End-Users login state at the OP. 
  It MUST NOT contain the space (" ") character. This value is opaque to the RP. 
  This is REQUIRED if session management is supported. The Session State value is 
  initially calculated on the server. The same Session State value is also 
  recalculated by the OP iframe in the browser client. The generation of suitable 
  Session State values is specified in Section 4.2, and is based on a salted 
  cryptographic hash of Client ID, origin URL, and OP browser state. For the origin 
  URL, the server can use the origin URL of the Authentication Response, following 
  the algorithm specified in Section 4 of RFC 6454 [RFC6454].';
comment on column ccbc_public.keycloak_jwt.acr is
  'OPTIONAL - Authentication Context Class Reference. String specifying an 
  Authentication Context Class Reference value that identifies the Authentication 
  Context Class that the authentication performed satisfied. The value "0" 
  indicates the End-User authentication did not meet the requirements of ISO/IEC 29115 
  [ISO29115] level 1. Authentication using a long-lived browser cookie, for instance, 
  is one example where the use of "level 0" is appropriate. Authentications with 
  level 0 SHOULD NOT be used to authorize access to any resource of any monetary 
  value. (This corresponds to the OpenID 2.0 PAPE [OpenID.PAPE] nist_auth_level 0.) 
  An absolute URI or an RFC 6711 [RFC6711] registered name SHOULD be used as the acr 
  value; registered names MUST NOT be used with a different meaning than that which 
  is registered. Parties using this claim will need to agree upon the meanings of 
  the values used, which may be context-specific. The acr value is a case sensitive 
  string.';
comment on column ccbc_public.keycloak_jwt.email_verified is
  'Whether or not a users email is verified with the login provider.';
comment on column ccbc_public.keycloak_jwt.name is
  'Users full name by combining given_name and family_name set and returned by login provider.';
comment on column ccbc_public.keycloak_jwt.preferred_username is
  'Username as set and returned by provider including provider name separated by @. eg. username@github';
comment on column ccbc_public.keycloak_jwt.given_name is
  'First name as set and returned by login provider.';
comment on column ccbc_public.keycloak_jwt.family_name is
  'Last name as set and returned by login provider.';
comment on column ccbc_public.keycloak_jwt.email is
  'Email address as set and returned by login provider.';
comment on column ccbc_public.keycloak_jwt.broker_session_id is
  'If created via a broker external login, this is an identifier that can be used to 
  match external broker backchannel logout requests to a UserSession';
comment on column ccbc_public.keycloak_jwt.identity_provider is
  'Name of the identity provider.';

comment on type ccbc_public.keycloak_jwt is E'@primaryKey sub\n@foreignKey (sub) references ccbc_user (session_sub)';

commit;
