import { JSONSchema7 } from 'json-schema';

const intake: JSONSchema7 = {
  description: '',
  type: 'object',
  required: ['startDate', 'endDate'],
  properties: {
    startDate: {
      title: 'Start date & time',
      type: 'string',
    },
    endDate: {
      title: 'End date & time',
      type: 'string',
    },
    description: {
      type: 'string',
      title: 'Announcement date',
    },
  },
};

export default intake;
