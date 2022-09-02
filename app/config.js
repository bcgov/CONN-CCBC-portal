/* eslint-disable @typescript-eslint/no-var-requires */
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
  HAPPO_API_KEY: {
    doc: 'Happo API key',
    format: String,
    default: '',
    env: 'HAPPO_API_KEY',
  },
  HAPPO_API_SECRET: {
    doc: 'Happo API secret',
    format: String,
    default: '',
    env: 'HAPPO_API_SECRET',
  },
  CLIENT_SECRET: {
    doc: 'SSO KeyCloak client secret',
    format: String,
    default: '',
    env: 'CLIENT_SECRET',
  },
  HOST: {
    doc: 'The address to where the app is hosted',
    format: String,
    default: 'localhost',
    env: 'HOST',
  },
  SITEMINDER_LOGOUT_URL: {
    doc: 'Logout URL',
    format: '*',
    default: '',
    env: 'SITEMINDER_LOGOUT_URL',
  },
  OPENSHIFT_APP_NAMESPACE: {
    doc: 'Namespace on OpenShift to which the app is deployed',
    format: ['ff61fb-dev', 'ff61fb-test', 'ff61fb-prod', ''],
    default: '',
    env: 'OPENSHIFT_APP_NAMESPACE',
  },
  SESSION_SECRET: {
    doc: 'Random string for session secret. Set this in dev',
    format: String,
    default: '',
    env: 'SESSION_SECRET',
  },
  NEXT_PUBLIC_GROWTHBOOK_API_KEY: {
    doc: 'Growthbook API key',
    format: String,
    default: '',
    env: 'NEXT_PUBLIC_GROWTHBOOK_API_KEY',
  },
  ENABLE_MOCK_AUTH: {
    doc: 'Enable mock auth',
    format: Boolean,
    default: false,
    env: 'ENABLE_MOCK_AUTH',
  },
  AWS_S3_BUCKET: {
    doc: 'AWS S3 bucket name',
    format: String,
    default: '',
    env: 'AWS_S3_BUCKET',
  },
  AWS_S3_REGION: {
    doc: 'AWS S3 region',
    format: String,
    default: 'us-west-2',
    env: 'AWS_S3_REGION',
  },
  AWS_S3_KEY: {
    doc: 'AWS S3 key',
    format: String,
    default: '',
    env: 'AWS_S3_KEY',
  },
  AWS_S3_SECRET_KEY: {
    doc: 'AWS S3 secret key',
    format: String,
    default: '',
    env: 'AWS_S3_SECRET_KEY',
  },
  AWS_ROLE_ARN: {
    doc: 'AWS Role ARN',
    format: String,
    default: '',
    env: 'AWS_ROLE_ARN',
  },
  ENABLE_MOCK_TIME: {
    doc: 'Enable Mock Time',
    format: Boolean,
    default: false,
    env: 'ENABLE_MOCK_TIME',
  },
  ENABLE_MOCK_COOKIES: {
    doc: 'Enable DB Mocks Cookies',
    format: Boolean,
    default: false,
    env: 'ENABLE_MOCK_COOKIES',
  },
});

// Load environment dependent configuration
const env = config.get('NODE_ENV') || 'development';

try {
  config.loadFile('./' + env + '.json');
}
catch(e){
  console.log(e);
  console.log(env);
}
config.validate({ allowed: 'warn' });
if (config.get("OPENSHIFT_APP_NAMESPACE").endsWith("-prod") && config.get("ENABLE_MOCK_TIME")) {
  throw new Error("ENABLE_MOCK_TIME cannot be true with a -prod namespace.");
}
module.exports = config;
