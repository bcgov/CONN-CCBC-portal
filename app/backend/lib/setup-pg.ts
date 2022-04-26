import pg from 'pg';
import config from '../../config';

const getDatabaseUrl = () => {
  const PGUSER = config.get('PGUSER') || 'ccbc_app';

  let databaseURL = 'postgres://';

  databaseURL += PGUSER;
  if (config.get('PGPASSWORD')) {
    databaseURL += `:${config.get('PGPASSWORD')}`;
  }

  databaseURL += '@';

  databaseURL += config.get('PGHOST') || 'localhost';
  if (config.get('PGPORT')) {
    databaseURL += `:${config.get('PGPORT')}`;
  }

  databaseURL += '/';
  databaseURL += config.get('PGDATABASE') || 'ccbc';

  return databaseURL;
};

export const pgPool = new pg.Pool({ connectionString: getDatabaseUrl() });
