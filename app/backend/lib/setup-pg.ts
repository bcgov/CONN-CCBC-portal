/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
import pg from 'pg';
import config from '../../config/index.js';

export const getDatabaseUrl = () => {
  const PGUSER = config.get('PGUSER');
  const PGPASSWORD = config.get('PGPASSWORD');
  const PGHOST = config.get('PGHOST');
  const PGPORT = config.get('PGPORT');
  const PGDATABASE = config.get('PGDATABASE');

  const databaseURL = `postgres://${PGUSER}${
    PGPASSWORD ? ':' : ''
  }${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

  return databaseURL;
};

let pgPool: pg.Pool;
try {
  pgPool = new pg.Pool({ connectionString: getDatabaseUrl() });
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn(
    'Postgres not configured: missing or invalid credentials. DB will not be available.'
  );
  pgPool = undefined as any;
}
