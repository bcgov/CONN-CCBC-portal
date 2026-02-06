import PgManyToManyPlugin from '@graphile-contrib/pg-many-to-many';
import {
  postgraphile,
  createPostGraphileSchema,
  withPostGraphileContext,
  PostGraphileOptions,
  makePluginHook,
} from 'postgraphile';
import type { Request } from 'express';
import { graphql, GraphQLSchema } from 'graphql';
import { TagsFilePlugin } from 'postgraphile/plugins';
import PersistedOperationsPlugin from '@graphile/persisted-operations';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PostgraphileRc from '../../../.postgraphilerc';
import { pgPool, getDatabaseUrl } from '../setup-pg';
import authenticationPgSettings from './authenticationPgSettings';
import { generateDatabaseMockOptions } from './helpers';
import config from '../../../config';
import resolveFileUpload from './resolveFileUpload';
import PostGraphileUploadFieldPlugin from './uploadFieldPlugin';
import { reportServerError } from '../emails/errorNotification';
import { logConnection } from '../../lib/helpers/connectionLogger';

export const pgSettings: any = (req: Request) => {
  const opts = {
    ...authenticationPgSettings(req),
    ...generateDatabaseMockOptions(req.cookies, ['mocks.mocked_timestamp']),
  };
  return opts;
};

const pluginHook = makePluginHook([PersistedOperationsPlugin]);

let postgraphileOptions: PostGraphileOptions = {
  pluginHook,
  appendPlugins: [
    PgManyToManyPlugin,
    ConnectionFilterPlugin,
    TagsFilePlugin,
    PostGraphileUploadFieldPlugin,
    // PgOmitArchived,
    // PgOrderByRelatedPlugin,
    // FormChangeValidationPlugin,
  ],
  persistedOperationsDirectory: `./.persisted_operations/`,
  hashFromPayload: (request: any) => request?.id,
  classicIds: true,
  enableQueryBatching: true,
  dynamicJson: true,
  pgSettings,
  graphileBuildOptions: {
    ...PostgraphileRc.options.graphileBuildOptions,
    uploadFieldDefinitions: [
      {
        match: ({ table, column }) =>
          table === 'attachment' && column === 'file',
        resolve: resolveFileUpload,
      },
    ],
  },
};

const isProd = config.get('NODE_ENV') === 'production';
postgraphileOptions = {
  ...postgraphileOptions,
  ...(isProd
    ? {
        handleErrors: (errors) => {
          logConnection('graphql.handle-errors', {
            note: `errors: ${errors?.length ?? 0}`,
            service: 'postgraphile',
          });
          reportServerError(errors, { source: 'postgraphile' });
          return errors;
        },
      }
    : {
        extendedErrors: ['hint', 'detail', 'errcode'],
        showErrorStack: 'json',
      }),
};

if (isProd) {
  postgraphileOptions = {
    ...postgraphileOptions,
    retryOnInitFail: true,
  };
} else {
  postgraphileOptions = {
    ...postgraphileOptions,
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: true,
    allowUnpersistedOperation(req) {
      return req.headers.referer?.endsWith("/graphiql");
    },
  };
}

const postgraphileMiddleware = () => {
  logConnection('graphql.middleware.init', {
    service: 'postgraphile',
    note: isProd ? 'prod mode' : 'dev mode',
  });
  const middleware = postgraphile(
    pgPool,
    config.get('PGSCHEMA'),
    postgraphileOptions
  );

  return (req: Request, res: any, next: any) => {
    const operation =
      req?.body?.operationName ||
      req?.body?.id ||
      req?.query?.operationName ||
      req?.query?.id;
    const start = Date.now();
    logConnection('graphql.request.start', {
      method: req.method,
      url: req.originalUrl || req.url,
      service: 'postgraphile',
      note: operation ? `operation: ${operation}` : 'operation: unknown',
    });

    res.on('finish', () => {
      logConnection('graphql.request.finish', {
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
        service: 'postgraphile',
      });
    });

    res.on('close', () => {
      if (!res.writableEnded) {
        logConnection('graphql.request.close', {
          method: req.method,
          url: req.originalUrl || req.url,
          durationMs: Date.now() - start,
          service: 'postgraphile',
          note: 'connection closed before response finished',
        });
      }
    });

    res.on('error', (error: Error) => {
      logConnection('graphql.request.error', {
        method: req.method,
        url: req.originalUrl || req.url,
        durationMs: Date.now() - start,
        service: 'postgraphile',
        note: error?.message,
      });
    });

    return middleware(req, res, next);
  };
};

export default postgraphileMiddleware;

let postgraphileSchemaSingleton: GraphQLSchema;

const postgraphileSchema = async () => {
  if (!postgraphileSchemaSingleton) {
    postgraphileSchemaSingleton = await createPostGraphileSchema(
      getDatabaseUrl(),
      config.get('PGSCHEMA'),
      postgraphileOptions
    );
  }

  return postgraphileSchemaSingleton;
};

export async function performQuery(id: any, variables: any, request: any) {
  const settings = pgSettings(request);
  return withPostGraphileContext(
    {
      pgPool,
      pgSettings: settings,
    },
    async (context) =>
      // Execute your GraphQL query in this function with the provided
      // `context` object, which should NOT be used outside of this
      // function.
      graphql(await postgraphileSchema(), id, null, { ...context }, variables)
  );
}
