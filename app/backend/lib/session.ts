import crypto from 'crypto';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pgPool } from './setup-pg';
import config from '../../config';

const PgSession = connectPgSimple(expressSession);
const sessionSecret =
  config.get('SESSION_SECRET') || crypto.randomBytes(32).toString();
const isProd = config.get('NODE_ENV') === 'production';

const HALF_DAY = 12 * (60 * 60 * 1000);
const ONE_DAY = 2 * HALF_DAY;

const session = () => {
  console.log('session');
  console.log(pgPool);
  const store = new PgSession({
    pool: pgPool,
    schemaName: 'ccbc_private',
    tableName: 'connect_session',
  });

  const middleware = expressSession({
    secret: sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // session expiration is set by default to 30 days
      maxAge: ONE_DAY,
      // httpOnly flag makes sure the cookie is only accessed
      // through the HTTP protocol and not JS/browser
      httpOnly: true,
      // secure cookie should be turned to true to provide additional
      // layer of security so that the cookie is set only when working
      // in HTTPS mode.
      secure: isProd,
      // commenting out sameSite to see if that's causing our cookie issues
      // sameSite: 'lax',
    },
  });

  return { middleware, store };
};

export default session;
