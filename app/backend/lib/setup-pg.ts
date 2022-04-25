import pg from 'pg';

const getDatabaseUrl = () => {
  const PGUSER = process.env.PGUSER || 'ccbc_app';

  let databaseURL = 'postgres://';

  databaseURL += PGUSER;
  if (process.env.PGPASSWORD) {
    databaseURL += `:${process.env.PGPASSWORD}`;
  }

  databaseURL += '@';

  databaseURL += process.env.PGHOST || 'localhost';
  if (process.env.PGPORT) {
    databaseURL += `:${process.env.PGPORT}`;
  }

  databaseURL += '/';
  databaseURL += process.env.PGDATABASE || 'ccbc';

  return databaseURL;
};

export const pgPool = new pg.Pool({ connectionString: getDatabaseUrl() });
