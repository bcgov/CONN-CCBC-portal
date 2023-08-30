import { JSONSchema7 } from 'json-schema';

const claims: JSONSchema7 = {
  description: '',
  type: 'object',
  required: ['dueDate'],
  properties: {
    claimsFile: {
      title: 'Upload the completed claims & progress report',
      type: 'string',
    },
  },
};

export default claims;
