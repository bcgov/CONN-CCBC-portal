import { RJSFSchema } from '@rjsf/utils';

const analyst: RJSFSchema = {
  description: '',
  type: 'object',
  required: ['givenName', 'familyName', 'email'],
  properties: {
    givenName: {
      title: 'Given Name',
      type: 'string',
    },
    familyName: {
      title: 'Family Name',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
  },
};

export default analyst;
