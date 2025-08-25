import commonAssessment from './commonAssessment';

const technicalSchema = {
  technical: {
    properties: {
      ...commonAssessment,
      decision: {
        title: 'Decision',
        default: 'No decision',
      },
    },
  },
};

export default technicalSchema;
