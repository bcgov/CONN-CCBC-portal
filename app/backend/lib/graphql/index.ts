import type { Request } from 'express';
import {
  postgraphile,
  createPostGraphileSchema,
  withPostGraphileContext,
} from 'postgraphile';
import PostgraphileRc from '../../../.postgraphilerc';

import { pgPool, getDatabaseUrl } from '../setup-pg';
import { PostGraphileOptions } from 'postgraphile';
import authenticationPgSettings from './authenticationPgSettings';
import {TagsFilePlugin} from 'postgraphile/plugins'

import { generateDatabaseMockOptions } from "./helpers";
import { graphql, GraphQLSchema } from 'graphql';
import config from '../../../config';
import resolveFileUpload from './resolveFileUpload';
import PostGraphileUploadFieldPlugin from './uploadFieldPlugin';

export const pgSettings: any = (req: Request) => {
  const opts = {
    ...authenticationPgSettings(req),
    ...generateDatabaseMockOptions(req.cookies, ["mocks.mocked_timestamp"]),
  };
  return opts;
};

let postgraphileOptions: PostGraphileOptions = {
  appendPlugins: [
    // PgManyToManyPlugin,
    // ConnectionFilterPlugin,
    TagsFilePlugin,
    PostGraphileUploadFieldPlugin,
    // PgOmitArchived,
    // PgOrderByRelatedPlugin,
    // FormChangeValidationPlugin,
  ],
  classicIds: true,
  enableQueryBatching: true,
  dynamicJson: true,
  extendedErrors: ['hint', 'detail', 'errcode'],
  showErrorStack: 'json',
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

if (config.get('NODE_ENV') === 'production') {
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
  };
}

const postgraphileMiddleware = () => {
  return postgraphile(pgPool, config.get('PGSCHEMA'), postgraphileOptions);
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

export async function performQuery(
  query: any,
  variables: any,
  request: Request
) {
  const settings = pgSettings(request);
  return withPostGraphileContext(
    {
      pgPool,
      pgSettings: settings,
    },
    async (context) => {
      // Execute your GraphQL query in this function with the provided
      // `context` object, which should NOT be used outside of this
      // function.
      return graphql(
        await postgraphileSchema(),
        query,
        null,
        { ...context },
        variables
      );
    }
  );
}
