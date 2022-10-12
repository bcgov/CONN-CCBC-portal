const pluralize = require('pluralize');

pluralize.addSingularRule(/data$/i, 'data');

module.exports = {
  options: {
    appendPlugins: [
      `${process.cwd()}/backend/lib/graphql/uploadFieldPlugin.js`,
      '@graphile-contrib/pg-many-to-many',
    ],
    graphileBuildOptions: {
      connectionFilterAllowNullInput: true,
      connectionFilterRelations: true,
      connectionFilterAllowEmptyObjectInput: true,
      pgStrictFunctions: true, // allows functions to be called with null arguments
      pgArchivedColumnName: 'archived_at',
      pgArchivedColumnImpliesVisible: false,
      pgArchivedRelations: false,
    },
  },
};
