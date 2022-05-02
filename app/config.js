const convict = require('convict');

// import dotenv to optionally overrride node-convict config
require('dotenv').config();

const config = convict({
  NODE_ENV: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env',
  },
  ORIGIN: {
    doc: 'Application origin',
    format: String,
    default: 'localhost',
    env: 'ORIGIN',
  },
  PORT: {
    doc: 'Application port',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  PGUSER: {
    doc: 'Postgres user',
    format: String,
    default: 'ccbc_app',
    env: 'PGUSER',
  },
  PGPASSWORD: {
    doc: 'Postgres password',
    format: String,
    default: '',
    env: 'PGPASSWORD',
  },
  PGHOST: {
    doc: 'Postgres host',
    format: String,
    default: 'localhost',
    env: 'PGHOST',
  },
  PGPORT: {
    doc: 'Application port',
    format: 'port',
    default: 5432,
    env: 'PGPORT',
  },
  PGDATABASE: {
    doc: 'Postgres database name',
    format: String,
    default: 'ccbc',
    env: 'PGDATABASE',
  },
  PGSCHEMA: {
    doc: 'Postgres database schema',
    format: String,
    default: 'ccbc_public',
    env: 'PGSCHEMA',
  },
});

// Load environment dependent configuration
const env = config.get('NODE_ENV') || 'development';
config.loadFile('./' + env + '.json');

config.validate({ allowed: 'warn' });

module.exports = config;
