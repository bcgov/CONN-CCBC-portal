import { RJSFSchema } from '@rjsf/utils';
import ALL_INTAKE_ZONES from 'data/intakeZones';

const intake: RJSFSchema = {
  description: '',
  type: 'object',
  required: ['startDate', 'endDate', 'zones'],
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
    zones: {
      title: 'Zones',
      type: 'array',
      minItems: 1,
      items: {
        type: 'number',
        enum: ALL_INTAKE_ZONES,
      },
      uniqueItems: true,
    },
    rollingIntake: {
      type: 'boolean',
    },
    inviteOnlyIntake: {
      type: 'boolean',
    },
    allowUnlistedFnLedZones: {
      type: 'boolean',
      default: false,
    },
  },
};

export default intake;
