import { postgraphile } from 'postgraphile';
import { pgPool } from './setup-pg';
import config from '../../config';

let postgraphileOptions = {
  classicIds: true,
  enableQueryBatching: true,
  dynamicJson: true,
  extendedErrors: ['hint', 'detail', 'errcode'],
  showErrorStack: true, // setting this to "json" results in a typescript error
  graphiql: true,
  enhanceGraphiql: true,
  retryOnInitFail: false,
  allowExplain: false,
};

if (config.get('NODE_ENV') === 'production') {
  postgraphileOptions = {
    ...postgraphileOptions,
    retryOnInitFail: true,
  };
} else {
  postgraphileOptions = {
    ...postgraphileOptions,
    allowExplain: true,
  };
}

const postgraphileMiddleware = () => {
  return postgraphile(pgPool, config.get('PGSCHEMA') || 'ccbc_public', {
    ...postgraphileOptions,
  });
};

export default postgraphileMiddleware;
