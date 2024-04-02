import commonAssessment from './commonAssessment';

const screeningSchema = {
  screening: {
    properties: {
      ...commonAssessment,
      contestingMap: {
        title: 'Contesting Map',
      },
    },
  },
};

export default screeningSchema;
