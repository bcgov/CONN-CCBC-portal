import { RJSFSchema } from '@rjsf/utils';

const projectDataReviews: RJSFSchema = {
  title: 'Project data reviews',
  description: '',
  type: 'object',
  properties: {
    locked: {
      type: 'boolean',
      title: 'Locked',
    },
    lastReviewed: {
      type: 'string',
      title: 'Last Reviewed',
    },
    reviewNotes: {
      type: 'string',
      title: 'Review Notes',
    },
  },
};

export default projectDataReviews;
