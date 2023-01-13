import { pgPool } from './setup-pg';
import schema from '../../formSchema/schema';
import {
  financialRisk,
  permitting,
  projectManagement,
  screening,
  technical,
} from '../../formSchema/analyst';

const importJsonSchemasToDb = async () => {
  const client = await pgPool.connect();
  try {
    await client.query('begin');
    await client.query('set local role ccbc_job_executor');
    // since the slugs are unique, if it already exists we update since we may the schema may have been updated
    const insertQuery = `insert into ccbc_public.form (slug, json_schema, description, form_type)
    values($1, $2, $3, $4) on conflict (slug) do update set
    json_schema=excluded.json_schema, description=excluded.description, form_type = excluded.form_type`;
    await client.query(insertQuery, [
      'intake1schema',
      schema,
      'Schema of the first batch of applications',
      'intake',
    ]);

    await client.query(insertQuery, [
      'financialRiskAssessmentSchema',
      financialRisk,
      'Schema of the financial risk assessment for analysts',
      'assessment',
    ]);

    await client.query(insertQuery, [
      'projectManagementAssessmentSchema',
      projectManagement,
      'Schema of the project management assessment for analysts',
      'assessment',
    ]);

    await client.query(insertQuery, [
      'screeningAssessmentSchema',
      screening,
      'Schema of the screening assessment for analysts',
      'assessment',
    ]);

    await client.query(insertQuery, [
      'technicalAssessmentSchema',
      technical,
      'Schema of the technical assessment for analysts',
      'assessment',
    ]);

    await client.query(insertQuery, [
      'permittingAssessmentSchema',
      permitting,
      'Schema of the permitting assessment for analysts',
      'assessment',
    ]);

    // to add new schemas, use the use await client.query(insertQuery, [<slug>, <schema>, <description>, <form_type: intake | rfi>])
    await client.query('commit');
  } catch (e) {
    await client.query('rollback');
    // rethrow so we don't silently fail without finding out the issue
    console.error(e);
    throw e;
  } finally {
    // release the client so it becomes available again to the pool
    client.release();
  }
};

export default importJsonSchemasToDb;
