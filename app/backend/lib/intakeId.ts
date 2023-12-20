import { performQuery } from './graphql';

const getIntakeIdQuery = `
query getIntakeIdQuery($ccbcIntakeNumber: Int!) {
  allIntakes (condition: {ccbcIntakeNumber: $ccbcIntakeNumber }) {
    nodes {
      closeTimestamp
      rowId
    }
  }
}
`;

const getIntakeId = async (req) => {
  const intakes = await performQuery(
    getIntakeIdQuery,
    { ccbcIntakeNumber: parseInt(req.params.intake as string, 10) },
    req
  );
  if (intakes.errors) {
    throw new Error(
      `Failed to retrieve intake data:\n${intakes.errors.join('\n')}`
    );
  }
  return intakes.data.allIntakes.nodes[0].rowId;
};

export default getIntakeId;
