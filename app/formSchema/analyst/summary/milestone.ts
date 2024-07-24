import { RJSFSchema } from '@rjsf/utils';

const milestone: RJSFSchema = {
  title: 'Milestone',
  description: '',
  type: 'object',
  required: ['percentProjectMilestoneComplete'],
  properties: {
    percentProjectMilestoneComplete: {
      type: 'string',
      title: 'Project Milestone Complete',
    },
  },
};

export default milestone;
