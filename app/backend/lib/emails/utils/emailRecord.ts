import { performQuery } from '../../graphql';

const emailRecordMutation = `
  mutation emailRecordMutation($input: CreateEmailRecordInput!) {
    createEmailRecord(input: $input) {
      emailRecord {
        id
      }
      clientMutationId
    }
  }
`;

const recordEmailRecord = async (input, req) => {
  try {
    const result = await performQuery(emailRecordMutation, { input }, req);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error recording email record:', error);
    throw error;
  }
};

export default recordEmailRecord;
