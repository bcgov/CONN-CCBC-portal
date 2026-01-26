import { RJSFSchema } from '@rjsf/utils';

const miscellaneous: RJSFSchema = {
  title: 'Miscellaneous',
  description: '',
  type: 'object',
  required: ['linkedProject'],
  properties: {
    linkedProject: {
      type: 'string',
      title: 'Parent/Child Project(s)',
    },
    internalNotes: {
      type: 'string',
      title: 'Internal Notes',
    },
  },
};

export default miscellaneous;
