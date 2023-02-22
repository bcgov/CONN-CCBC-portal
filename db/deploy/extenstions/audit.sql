-- Deploy ccbc:extenstions/audit to pg

BEGIN;

-- SPDX-License-Identifier: Apache-2.0
/*
    Generic Audit Trigger
    Linear Time Record Version History

    Date:
        2022-02-03

    Purpose:
        Generic audit history for tables including an indentifier
        to enable indexed linear time lookup of a primary key's version history
*/


-- Namespace to "audit"
create schema if not exists audit;


-- Create enum type for SQL operations to reduce disk/memory usage vs text
create type audit.operation as enum (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE'
);


create table ccbc_public.record_version(
    -- unique auto-incrementing id
    id             bigserial primary key,
    -- uniquely identifies a record by primary key [primary key + table_oid]
    record_id      uuid,
    -- uniquely identifies a record before update/delete
    old_record_id  uuid,
    -- INSERT/UPDATE/DELETE/TRUNCATE/SNAPSHOT
    op             audit.operation not null,
    ts             timestamptz not null default (now()),
    table_oid      oid not null,
    table_schema   name not null,
    table_name     name not null,
    created_by     int null references ccbc_public.ccbc_user(id), 
    created_at     timestamptz not null, --not null,
    -- contents of the record
    record         jsonb,
    -- previous record contents for UPDATE/DELETE
    old_record     jsonb,

    -- at least one of record_id or old_record_id is populated, except for truncates
    check (coalesce(record_id, old_record_id) is not null or op = 'TRUNCATE'),

    -- record_id must be populated for insert and update
    check (op in ('INSERT', 'UPDATE') = (record_id is not null)),
    check (op in ('INSERT', 'UPDATE') = (record is not null)),

    -- old_record must be populated for update and delete
    check (op in ('UPDATE', 'DELETE') = (old_record_id is not null)),
    check (op in ('UPDATE', 'DELETE') = (old_record is not null))
);

do $$
    begin
        -- Detect if we're in a supabase project
        -- Ensure `auth.uid() -> uuid` and `auth.role() -> text` exist
        if (
            select
                count(distinct f.proname) = 2
            from
                pg_proc f
                join pg_namespace nsp
                    on f.pronamespace = nsp.oid
                join pg_type pt
                    on f.prorettype = pt.oid
            where
                (nsp.nspname, f.proname, pt.typname) in (
                    ('auth', 'uid',  'uuid'),
                    ('auth', 'role', 'text')
                )
                and f.pronargs = 0
            )
            then

            alter table ccbc_public.record_version add column auth_uid  uuid default (auth.uid());
            alter table ccbc_public.record_version add column auth_role text default (auth.role());
        end if;
    end
$$;


create index record_version_record_id
    on ccbc_public.record_version(record_id)
    where record_id is not null;


create index record_version_old_record_id
    on ccbc_public.record_version(old_record_id)
    where old_record_id is not null;


create index record_version_ts
    on ccbc_public.record_version
    using brin(ts);


create index record_version_table_oid
    on ccbc_public.record_version(table_oid);


create or replace function audit.primary_key_columns(entity_oid oid)
    returns text[]
    stable
    security definer
    set search_path = ''
    language sql
as $$
    -- Looks up the names of a table's primary key columns
    select
        coalesce(
            array_agg(pa.attname::text order by pa.attnum),
            array[]::text[]
        ) column_names
    from
        pg_index pi
        join pg_attribute pa
            on pi.indrelid = pa.attrelid
            and pa.attnum = any(pi.indkey)

    where
        indrelid = $1
        and indisprimary
$$;


create or replace function audit.to_record_id(entity_oid oid, pkey_cols text[], rec jsonb)
    returns uuid
    stable
    language sql
as $$
    select
        case
            when rec is null then null
            when pkey_cols = array[]::text[] then public.uuid_generate_v4()
            else (
                select
                    public.uuid_generate_v5(
                        'fd62bc3d-8d6e-43c2-919c-802ba3762271',
                        ( jsonb_build_array(to_jsonb($1)) || jsonb_agg($3 ->> key_) )::text
                    )
                from
                    unnest($2) x(key_)
            )
        end
$$;


create or replace function audit.insert_update_delete_trigger()
    returns trigger
    security definer
    -- can not use search_path = '' here because audit.to_record_id requires
    -- uuid_generate_v4, which may be installed in a user-defined schema
    language plpgsql
as $$
declare
    pkey_cols text[] = audit.primary_key_columns(TG_RELID);

    record_jsonb jsonb = to_jsonb(new);
    record_id uuid = audit.to_record_id(TG_RELID, pkey_cols, record_jsonb);

    old_record_jsonb jsonb = to_jsonb(old);
    old_record_id uuid = audit.to_record_id(TG_RELID, pkey_cols, old_record_jsonb);
    old_created_by int = COALESCE(new.created_by, 1); -- record_jsonb::json->'created_by';
    old_created_at timestamptz = COALESCE(new.created_at, now()); -- record_jsonb::json->'created_at'; 
begin
    insert into ccbc_public.record_version(
        record_id,
        old_record_id,
        op,
        table_oid,
        table_schema,
        table_name,
        created_by,
        created_at,
        record,
        old_record
    )
    select
        record_id,
        old_record_id,
        TG_OP::audit.operation,
        TG_RELID,
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        old_created_by,
        old_created_at,
        record_jsonb,
        old_record_jsonb;

    return coalesce(new, old);
end;
$$;


create or replace function audit.enable_tracking(regclass)
    returns void
    volatile
    security definer
    set search_path = ''
    language plpgsql
as $$
declare
    statement_row text = format('
        create trigger audit_i_u_d
            after insert or update
            on %s
            for each row
            execute procedure audit.insert_update_delete_trigger();',
        $1
    );

    pkey_cols text[] = audit.primary_key_columns($1);
begin
    if pkey_cols = array[]::text[] then
        raise exception 'Table % can not be audited because it has no primary key', $1;
    end if;

    if not exists(select 1 from pg_trigger where tgrelid = $1 and tgname = 'audit_i_u_d') then
        execute statement_row;
    end if;

end;
$$;


create or replace function audit.disable_tracking(regclass)
    returns void
    volatile
    security definer
    set search_path = ''
    language plpgsql
as $$
declare
    statement_row text = format(
        'drop trigger if exists audit_i_u_d on %s;',
        $1
    );

begin
    execute statement_row;
end;
$$;

GRANT USAGE ON SCHEMA audit TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
GRANT ALL ON ALL TABLES IN SCHEMA audit TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
GRANT ALL ON ALL ROUTINES IN SCHEMA audit TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA audit TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA audit GRANT ALL ON TABLES TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA audit GRANT ALL ON ROUTINES TO ccbc_auth_user, ccbc_analyst, ccbc_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA audit GRANT ALL ON SEQUENCES TO ccbc_auth_user, ccbc_analyst, ccbc_admin;

do
$grant$
begin
perform ccbc_private.grant_permissions('select', 'record_version', 'ccbc_analyst'); 
perform ccbc_private.grant_permissions('select', 'record_version', 'ccbc_admin'); 
perform ccbc_private.grant_permissions('select', 'record_version', 'ccbc_auth_user');

end
$grant$;

-- 
select audit.enable_tracking('ccbc_public.application'::regclass);
select audit.enable_tracking('ccbc_public.application_status'::regclass);
select audit.enable_tracking('ccbc_public.attachment'::regclass);
select audit.enable_tracking('ccbc_public.assessment_data'::regclass);
select audit.enable_tracking('ccbc_public.rfi_data'::regclass);


COMMIT;
