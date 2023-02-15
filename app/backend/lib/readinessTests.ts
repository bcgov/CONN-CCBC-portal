import type { Pool, PoolClient } from 'pg';
import type { Lightship } from 'lightship';
import s3Client from './s3client';

async function readinessTest(pgPool: Pool, lightship: Lightship) {
  let client: PoolClient;
  let url: string = null;
  try {
    client = await pgPool.connect();

    await client.query('begin');

    await client.query('select * from ccbc_public.intake');

    url = await s3Client.getSignedUrlPromise('getObject', {
      Bucket: 'fapi7b-dev-ccbc-clamav',
      Key: 'bytecode.cvd',
      Expires: 60,
      ResponseContentDisposition: `attachment; filename="bytecode.cvd"`,
    });

    // to add new schemas, use the use await client.query(insertQuery, [<slug>, <schema>, <description>, <form_type: intake | rfi>])
    await client.query('commit');
  } catch (e) {
    if (client) {
      await client.query('rollback');
    }
    // rethrow so we don't silently fail without finding out the issue
    console.error(e);
    // throw e;
    lightship.signalNotReady();
  } finally {
    // release the client so it becomes available again to the pool
    if (client) {
      client.release();
    }
    if (client && url) {
      lightship.signalReady();
    }
  }
}

export default readinessTest;
