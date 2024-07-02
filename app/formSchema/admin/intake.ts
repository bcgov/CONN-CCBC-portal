import { RJSFSchema } from '@rjsf/utils';

const intake: RJSFSchema = {
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
    rollingIntake: {
      type: 'boolean',
    },
  },
};

export default intake;
