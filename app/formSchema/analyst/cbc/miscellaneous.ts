import { RJSFSchema } from '@rjsf/utils';

const miscellaneous: RJSFSchema = {
  title: 'Miscellaneous',
  description: '',
  type: 'object',
  properties: {
    childProjects: {
      type: 'string',
      title: 'Child Project(s)',
    },
    projectMilestoneCompleted: {
      type: 'number',
      title: '% Project Milestone Completed',
    },
    constructionCompletedOn: {
      type: 'string',
      title: 'Construction Completed on',
    },
    milestoneComments: {
      type: 'string',
      title: 'Milestone Comments',
    },
    primaryNewsRelease: {
      type: 'string',
      title: 'Primary News Release',
    },
    secondaryNewsRelease: {
      type: 'string',
      title: 'Secondary News Release',
    },
    notes: {
      type: 'string',
      title: 'Notes',
    },
  },
};

export default miscellaneous;
