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
  AUTH_SERVER_URL: {
    doc: 'Auth server URL',
    format: '*',
    default: '',
    env: 'AUTH_SERVER_URL',
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
  MOCK_ROLE_COOKIE_NAME: {
    doc: 'name of the cookie used to retrieve the mock user role when ENABLE_MOCK_AUTH is true',
    format: String,
    default: 'mocks.auth_role',
    env: 'MOCK_ROLE_COOKIE_NAME',
  },
  AWS_CLAM_S3_BUCKET: {
    doc: 'AWS S3 bucket for ClamAV',
    format: String,
    default: '',
    env: 'AWS_CLAM_S3_BUCKET',
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
  // AWS_ACCESS_KEY_ID is read directly and not through config
  AWS_ACCESS_KEY_ID: {
    doc: 'AWS S3 key',
    format: String,
    default: '',
    env: 'AWS_ACCESS_KEY_ID',
  },
  // AWS_SECRET_ACCESS_KEY is read directly and not through config
  AWS_SECRET_ACCESS_KEY: {
    doc: 'AWS S3 secret key',
    format: String,
    default: '',
    env: 'AWS_SECRET_ACCESS_KEY',
  },
  AWS_ROLE_ARN: {
    doc: 'AWS Role ARN',
    format: String,
    default: '',
    env: 'AWS_ROLE_ARN',
  },
  ARCHIVE_REQUEST_TOPIC_ARN: {
    doc: 'AWS SNS Archvie request topic ARN',
    format: String,
    default: 'arn:aws:sns:ca-central-1:780887525069:ccbc-export-files',
    env: 'ARCHIVE_REQUEST_TOPIC_ARN',
  },
  ENABLE_AWS_LOGS: {
    doc: 'Enable AWS logging in the console console',
    format: Boolean,
    default: false,
    env: 'ENABLE_AWS_LOGS',
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
  CHECK_TAGS: {
    doc: 'Enable checking tags on s3 object',
    format: Boolean,
    default: true,
    env: 'CHECK_TAGS',
  },
  METABASE_EMBED_SECRET: {
    doc: 'Metabase embed secret',
    format: String,
    default: '',
    env: 'METABASE_EMBED_SECRET',
  },
  METABASE_SITE_URL: {
    doc: 'Metabase site url',
    format: String,
    default: '',
    env: 'METABASE_SITE_URL',
  },
  SP_SITE: {
    doc: 'SharePoint Site URL',
    format: String,
    default: '',
    env: 'SP_SITE',
  },
  SP_MS_FILE_NAME: {
    doc: 'SharePoint master spreadsheet File Name',
    format: String,
    default: '',
    env: 'SP_MS_FILE_NAME',
  },
  SP_DOC_LIBRARY: {
    doc: 'SharePoint document library',
    format: String,
    default: '',
    env: 'SP_DOC_LIBRARY',
  },
  SP_SA_USER: {
    doc: 'SharePoint service account user',
    format: String,
    default: '',
    env: 'SP_SA_USER',
  },
  SP_SA_PASSWORD: {
    doc: 'SharePoint service account password',
    format: String,
    default: '',
    env: 'SP_SA_PASSWORD',
  },
  KEYCLOAK_SA_CLIENT_ID: {
    doc: 'Keycloak service account client id',
    format: String,
    default: '',
    env: 'KEYCLOAK_SA_CLIENT_ID',
  },
  KEYCLOAK_SA_CLIENT_SECRET: {
    doc: 'Keycloak service account client secret',
    format: String,
    default: '',
    env: 'KEYCLOAK_SA_CLIENT_SECRET',
  },
  SP_LIST_NAME: {
    doc: 'SharePoint list name',
    format: String,
    default: '',
    env: 'SP_LIST_NAME',
  },
  CHES_API_URL: {
    doc: 'CHES API URL',
    format: String,
    default: '',
    env: 'CHES_API_URL',
  },
  CHES_CLIENT: {
    doc: 'CHES API client',
    format: String,
    default: '',
    env: 'CHES_CLIENT',
  },
  CHES_CLIENT_SECRET: {
    doc: 'CHES API client secret',
    format: String,
    default: '',
    env: 'CHES_CLIENT_SECRET',
  },
  CHES_TO_EMAIL: {
    doc: 'CHES temporary to email',
    format: String,
    default: '',
    env: 'CHES_TO_EMAIL',
  },
  CHES_KEYCLOAK_HOST: {
    doc: 'Keycloak host for CHES',
    format: String,
    default: '',
    env: 'CHES_KEYCLOAK_HOST',
  },
  COVERAGES_FILE_NAME: {
    doc: 'Coverages file name',
    format: String,
    default: 'CCBC_APPLICATION_COVERAGES_AGGREGATED_NoDATA.zip',
    env: 'COVERAGES_FILE_NAME',
  },
});

// Load environment dependent configuration
const namespace = config.get('OPENSHIFT_APP_NAMESPACE') || 'dev-local';
const chunks = namespace.split('-');
const env =
  config.get('NODE_ENV') !== 'development'
    ? chunks[chunks.length - 1] || 'local'
    : 'local';

try {
  config.loadFile(`./config/${env}.json`);
} catch (e) {
  console.error(e);
  console.error(env);
}
config.validate({ allowed: 'warn' });
if (
  config.get('OPENSHIFT_APP_NAMESPACE').endsWith('-prod') &&
  config.get('ENABLE_MOCK_TIME')
) {
  throw new Error('ENABLE_MOCK_TIME cannot be true with a -prod namespace.');
}

if (
  config.get('OPENSHIFT_APP_NAMESPACE').endsWith('-prod') &&
  config.get('ENABLE_MOCK_AUTH')
) {
  throw new Error('ENABLE_MOCK_AUTH cannot be true with a -prod namespace.');
}

module.exports = config;
