import { JSONSchema7 } from 'json-schema';

const changeRequest: JSONSchema7 = {
  description: '',
  type: 'object',
  required: ['statementOfWorkUpload'],
  properties: {
    statementOfWorkUpload: {
      title: 'Upload the completed statement of work Excel file',
      type: 'string',
    },
  },
};

export default changeRequest;
