-- Revert ccbc:mutations/edit_cbc_project_communities from pg

BEGIN;

drop function ccbc_public.edit_cbc_project_communities(int, int[], int[]);

COMMIT;
