import { RJSFSchema } from '@rjsf/utils';

const pendingChangeRequestComment: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: [],
  properties: {
    comment: {
      title: '',
      type: 'string',
    },
  },
};

export default pendingChangeRequestComment;
