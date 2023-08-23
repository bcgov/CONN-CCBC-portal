import { JSONSchema7 } from 'json-schema';

const claims: JSONSchema7 = {
  required: ['dueDate'],
  properties: {
    fromDate: {
      title: 'From',
      type: 'string',
    },
    toDate: {
      title: 'To',
      type: 'string',
    },
    claimsFile: {
      title: 'Upload the completed claims & progress report',
      type: 'string',
    },
  },
};

export default claims;
