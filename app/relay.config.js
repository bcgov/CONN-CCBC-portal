module.exports = {
  src: './',
  schema: './schema/schema.graphql',
  language: 'typescript',
  artifactDirectory: './__generated__',
  excludes: [
    '**/.next/**',
    '**/node_modules/**',
    '**/__generated__/**',
    '**/server/**',
    '**/.persisted_operations/**',
  ],
  persistConfig: {
    file: './schema/queryMap.json',
  },
};
