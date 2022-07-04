-- Deploy ccbc:tables/connect_session to pg
-- requires: schemas/private

begin;

create table if not exists ccbc_private.connect_session (
  sid varchar(4096) not null collate "default",
	sess json not null,
	expire timestamp(6) not null
)
with (oids=false);

alter table ccbc_private.connect_session add constraint session_pkey primary key (sid) not deferrable initially immediate;
create index idx_session_expire on ccbc_private.connect_session(expire);
grant all on ccbc_private.connect_session to public;

comment on table ccbc_private.connect_session is 'The table that will contain the session used by connect-pg-simple';
comment on column ccbc_private.connect_session.sid is 'The value of the symmetric key encrypted connect.sid cookie';
comment on column ccbc_private.connect_session.sess is 'The express session middleware object picked as json containing the jwt';
comment on column ccbc_private.connect_session.expire is 'The timestamp after which this session object will be garbage collected';

commit;
