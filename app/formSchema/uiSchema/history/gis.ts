import commonAssessment from './commonAssessment';

const gis = {
  gis: {
    properties: {
      ...commonAssessment,
      decision: {
        title: 'Decision',
        default: 'No decision',
      },
      commentsOnCoverageData: {
        title: 'Comments on coverage data',
      },
      commentsOnHouseholdCounts: {
        title: 'Comments on household counts',
      },
      commentsOnOverbuild: {
        title: 'Comments on overbuild',
      },
      commentsOnOverlap: {
        title: 'Comments on overlap',
      },
    },
  },
};

export default gis;
