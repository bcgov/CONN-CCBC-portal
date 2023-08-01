import { JSONSchema7 } from 'json-schema';

const intake: JSONSchema7 = {
  description: '',
  type: 'object',
  required: ['startDate', 'endDate'],
  properties: {
    intakeNumber: {
      title: 'Intake #',
      type: 'number',
    },
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
      title: 'Description (optional)',
    },
  },
};

export default intake;
