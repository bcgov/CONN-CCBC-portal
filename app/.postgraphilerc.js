module.exports = {
  options: {
    appendPlugins: [
      `${process.cwd()}/backend/lib/graphql/uploadFieldPlugin.js`,
    ],
    graphileBuildOptions: {
      connectionFilterAllowNullInput: true,
      connectionFilterRelations: true,
      connectionFilterAllowEmptyObjectInput: true,
      pgStrictFunctions: true, // allows functions to be called with null arguments
      pgArchivedColumnName: 'archived_at',
      pgArchivedColumnImpliesVisible: false,
      pgArchivedRelations: false,
      uploadFieldDefinitions: [
        {
          match: ({ schema, table, column, tags }) =>
            table === 'attachment' && column === 'file',
        },
      ],
    },
  },
};
