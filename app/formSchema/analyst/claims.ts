import { RJSFSchema } from '@rjsf/utils';

const claims: RJSFSchema = {
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
