import { JSONSchema7 } from 'json-schema';

const milestones: JSONSchema7 = {
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
