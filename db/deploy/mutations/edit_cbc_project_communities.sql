-- Deploy ccbc:mutations/edit_cbc_project_communities to pg
begin;

create or replace function ccbc_public.edit_cbc_project_communities(_project_id int, _community_ids_to_add int[], _community_ids_to_archive int[]) returns setof ccbc_public.cbc_project_communities as
$$
declare
  _community_id int;
begin
  -- Insert new community ids into ccbc_public.cbc_project_communities table
  foreach _community_id in array _community_ids_to_add
  loop
    insert into ccbc_public.cbc_project_communities (project_id, community_id)
    values (_project_id, _community_id);
  end loop;

  -- Archive community ids that belong to _project_id
  update ccbc_public.cbc_project_communities
  set archived = true
  where project_id = _project_id
  and community_id = any(_community_ids_to_archive);

  return query select * from ccbc_public.cbc_project_communities where project_id = _project_id;

end;
$$ language plpgsql volatile;

commit;
