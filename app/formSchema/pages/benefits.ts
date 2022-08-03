const benefits = {
  benefits: {
    title: 'Benefits',
    type: 'object',
    description:
      'Quantify any estimation or claim about the effects of the proposed project to the targeted areas',
    required: [
      'projectBenefits',
      'numberOfHouseholds',
      'householdsImpactedIndigenous',
    ],
    properties: {
      projectBenefits: {
        type: 'string',
      },
      numberOfHouseholds: {
        type: 'number',
      },
      householdsImpactedIndigenous: {
        type: 'number',
      },
    },
  },
};

export default benefits;
