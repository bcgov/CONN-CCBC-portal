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

const getEmailRecordsByJsonDataFilter = `
  query getEmailRecordsByJsonDataFilterQuery($jsonDataFilter: JSON!) {
    allEmailRecords(filter: { jsonData: { contains: $jsonDataFilter } }) {
      edges {
        node {
          messageId
          rowId
          jsonData
        }
      }
    }
  }
`;

const setIsCancelledEmailRecordMutation = `
  mutation setIsCancelledEmailRecordMutation($rowId: Int!, jsonData: JSON!) {
    updateEmailRecordByRowId(
      input: {
        emailRecordPatch: { jsonData: $jsonData }
        rowId: $rowId
      }
    ) {
      clientMutationId
    }
  }
`;

export const recordEmailRecord = async (input, req) => {
  try {
    const result = await performQuery(emailRecordMutation, { input }, req);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error recording email record:', error);
    throw error;
  }
};

export const getDelayedAndNonCancelledEmailRecord = async (
  applicationId,
  tag,
  req
) => {
  try {
    const result = await performQuery(
      getEmailRecordsByJsonDataFilter,
      {
        jsonDataFilter: {
          applicationId,
          tag,
          isDelayed: true,
          isCancelled: false,
        },
      },
      req
    );
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      'Error fetching delayed and non-cancelled email records:',
      error
    );
    throw error;
  }
};

export const setIsCancelledEmailRecord = async (
  emailRecordId,
  jsonData,
  req
) => {
  try {
    await performQuery(
      setIsCancelledEmailRecordMutation,
      { rowId: emailRecordId, jsonData: { ...jsonData, isCancelled: true } },
      req
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error setting email record as cancelled:', error);
    throw error;
  }
};
