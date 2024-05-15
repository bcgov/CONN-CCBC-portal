import { RJSFSchema } from '@rjsf/utils';

const pendingChangeRequestCancel: RJSFSchema = {
  title: ' ',
  description: '',
  type: 'object',
  required: ['comment'],
  properties: {
    comment: {
      title: 'Please select the appropriate option below',
      type: 'string',
      enum: ['Yes, change request completed', 'Yes, change request cancelled'],
    },
  },
};

export default pendingChangeRequestCancel;
