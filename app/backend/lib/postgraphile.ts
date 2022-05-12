import { postgraphile } from 'postgraphile';
import { pgPool } from './setup-pg';
import config from '../../config.js';

let postgraphileOptions = {
  classicIds: true,
  enableQueryBatching: true,
  dynamicJson: true,
  extendedErrors: ['hint', 'detail', 'errcode'],
  showErrorStack: true, // setting this to "json" results in a typescript error
  graphiql: true,
  enhanceGraphiql: true,
  retryOnInitFail: true,
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
  return postgraphile(pgPool, config.get('PGSCHEMA'), {
    ...postgraphileOptions,
  });
};

export default postgraphileMiddleware;
