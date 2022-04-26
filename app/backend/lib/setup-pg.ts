import pg from 'pg';
import config from '../../config.js';

const getDatabaseUrl = () => {
  const PGUSER = config.get('PGUSER');
  const PGPASSWORD = config.get('PGPASSWORD');
  const PGHOST = config.get('PGHOST');
  const PGPORT = config.get('PGPORT');
  const PGDATABASE = config.get('PGDATABASE');

  const databaseURL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

  return databaseURL;
};

export const pgPool = new pg.Pool({ connectionString: getDatabaseUrl() });
