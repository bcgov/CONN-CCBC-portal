import type { Pool, PoolClient } from 'pg';
import type { Lightship } from 'lightship';
import { getSignedUrlPromise } from './s3client';
import config from '../../config';
import { reportServerError } from './emails/errorNotification';

const CLAM_BUCKET = config.get('AWS_CLAM_S3_BUCKET');

async function readinessTest(pgPool: Pool, lightship: Lightship) {
  let client: PoolClient;
  let url: string = null;
  try {
    client = await pgPool.connect();

    await client.query('begin');
    await client.query('select * from ccbc_public.intake');
    await client.query('commit');

    url = await getSignedUrlPromise({
      Bucket: CLAM_BUCKET,
      Key: 'bytecode.cvd',
      Expires: 60,
      ResponseContentDisposition: `attachment; filename="bytecode.cvd"`,
    });
  } catch (e) {
    if (client) {
      await client.query('rollback');
    }
    lightship.signalNotReady();
    reportServerError(e, { source: 'readiness-test' });
    // rethrow so we don't silently fail without finding out the issue
    throw e;
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
