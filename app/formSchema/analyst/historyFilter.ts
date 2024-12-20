import { RJSFSchema } from '@rjsf/utils';

const historyFilter = (historyTypes: any[], usersList: any[]): RJSFSchema => ({
  description: '',
  type: 'object',
  required: ['types', 'users'],
  properties: {
    types: {
      type: 'string',
      title: 'Type',
      enum: historyTypes,
    },
    users: {
      type: 'string',
      title: 'User',
      enum: usersList,
    },
  },
});

export default historyFilter;
