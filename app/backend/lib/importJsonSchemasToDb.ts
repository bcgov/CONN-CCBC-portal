import { pgPool } from './setup-pg';
import schema from '../../formSchema/schema';

const importJsonSchemasToDb = async () => {
  const client = await pgPool.connect();
  try {
    await client.query('begin');
    await client.query('set local role ccbc_job_executor');
    // since the slugs are unique, if it already exists we update since we may the schema may have been updated
    const insertQuery = `insert into ccbc_public.form (slug, json_schema, description)
    values($1, $2, $3) on conflict (slug) do update set
    json_schema=excluded.json_schema, description=excluded.description`;
    await client.query(insertQuery, [
      'intake1schema',
      schema,
      'Schema of the first batch of applications',
    ]);
    // to add new schemas, use the use await client.query(insertQuery, [<slug>, <schema>, <description>])
    await client.query('commit');
  } catch (e) {
    await pgPool.query('rollback');
    // rethrow so we don't silently fail without finding out the issue
    console.error(e);
    throw e;
  } finally {
    // release the client so it becomes available again to the pool
    client.release();
  }
};

export default importJsonSchemasToDb;
