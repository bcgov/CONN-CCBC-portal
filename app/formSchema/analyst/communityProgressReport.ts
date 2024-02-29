import { RJSFSchema } from '@rjsf/utils';

const communityProgressReport: RJSFSchema = {
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
