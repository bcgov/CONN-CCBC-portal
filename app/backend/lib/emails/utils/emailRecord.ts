import { performQuery } from '../../graphql';
import { reportServerError } from '../errorNotification';

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
    reportServerError(error, { source: 'email-record-create' }, req);
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
    reportServerError(error, { source: 'email-record-fetch-delayed' }, req);
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
    reportServerError(error, { source: 'email-record-cancel' }, req);
    throw error;
  }
};
