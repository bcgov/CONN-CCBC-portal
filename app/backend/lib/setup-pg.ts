import pg from 'pg';
import config from '../../config/index.js';
import { logConnection } from '../../lib/helpers/connectionLogger';

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

const pgHost = config.get('PGHOST');
const pgPort = config.get('PGPORT');
const pgDatabase = config.get('PGDATABASE');

export const pgPool = new pg.Pool({ connectionString: getDatabaseUrl() });

logConnection('startup.pg.pool', {
  host: pgHost,
  port: pgPort,
  database: pgDatabase,
});

pgPool.on('connect', () => {
  logConnection('pg.connect', {
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
  });
});

pgPool.on('error', (error) => {
  logConnection('pg.error', {
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
    note: error?.message,
  });
});
