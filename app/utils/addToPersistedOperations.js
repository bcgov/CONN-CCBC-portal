const { promises: fsp } = require('fs');
const map = require('../schema/queryMap.json');

// Util to split query map that Relay generates into individual queries for Postgraphile to use
const addToPersistedOperations = async () => {
  await Promise.all(
    Object.entries(map).map(([hash, query]) =>
      fsp.writeFile(
        `${__dirname}/../.persisted_operations/${hash}.graphql`,
        query
      )
    )
  );

  return 'Finished';
};

addToPersistedOperations();

module.exports = { addToPersistedOperations };
