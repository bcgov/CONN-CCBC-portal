const { promises: fsp } = require('fs');
const map = require('../schema/queryMap.json');

// Util to split query map that Relay generates into individual queries for Postgraphile to use
async function main() {
  await Promise.all(
    Object.entries(map).map(([hash, query]) =>
      fsp.writeFile(
        `${__dirname}/../.persisted_operations/${hash}.graphql`,
        query
      )
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
