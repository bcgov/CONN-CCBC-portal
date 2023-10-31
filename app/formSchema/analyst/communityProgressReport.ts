import { JSONSchema7 } from 'json-schema';

const communityProgressReport: JSONSchema7 = {
  description: '',
  type: 'object',
  required: ['dueDate'],
  properties: {
    dueDate: {
      title: 'Due date',
      type: 'string',
    },
    dateReceived: {
      title: 'Date received',
      type: 'string',
    },
    errorField: {
      type: 'string',
    },
    progressReportFile: {
      title: 'Upload the community progress report',
      type: 'string',
    },
  },
};

export default communityProgressReport;
