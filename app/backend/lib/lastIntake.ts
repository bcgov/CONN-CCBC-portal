import { performQuery } from './graphql';

const getLastIntakeQuery = `
query getAllIntakeQuery {
  allIntakes {
    nodes {
      closeTimestamp
      ccbcIntakeNumber
      rowId
    }
  }
}
`;

const getLastIntakeId = async (req) => {
  const allIntakes = await performQuery(getLastIntakeQuery, null, req);
  if (allIntakes.errors) {
    throw new Error(
      `Failed to retrieve form data:\n${allIntakes.errors.join('\n')}`
    );
  }

  const intakes = allIntakes.data.allIntakes.nodes;
  const sorted = intakes.sort((a, b) =>
    b.closeTimestamp.localeCompare(a.closeTimestamp)
  );
  const index = sorted.findIndex(
    (x) => Date.parse(x.closeTimestamp) < Date.now()
  );
  if (index === -1) {
    return { intakeId: index, intakeNumber: index };
  }
  return {
    intakeId: sorted[index].rowId,
    intakeNumber: sorted[index].ccbcIntakeNumber,
  };
};

export default getLastIntakeId;
