import { RJSFSchema } from '@rjsf/utils';

const milestones: RJSFSchema = {
  description: '',
  type: 'object',
  required: ['dueDate'],
  properties: {
    dueDate: {
      title: 'Due date',
      type: 'string',
    },
    milestoneFile: {
      title: 'Upload the milestone report',
      type: 'string',
    },
    evidenceOfCompletionFile: {
      title:
        'Upload evidence of milestone completion (if available, can be added at another time)',
      type: 'string',
    },
  },
};

export default milestones;
