import commonAssessment from './commonAssessment';

const permittingSchema = {
  permitting: {
    properties: {
      ...commonAssessment,
      decision: {
        title: 'Flags',
      },
      notesAndConsiderations: {
        title: 'Notes & Considerations',
      },
    },
  },
};

export default permittingSchema;
