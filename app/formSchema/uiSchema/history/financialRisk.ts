import commonAssessment from './commonAssessment';

const financialRiskSchema = {
  financialRisk: {
    properties: {
      ...commonAssessment,
      decision: {
        title: 'Decision',
        default: 'No decision',
      },
    },
  },
};

export default financialRiskSchema;
