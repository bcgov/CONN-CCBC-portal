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
        title:
          'Final number of Eligible Households targeted by this proposal. This value should match cell F141 in Template 1.',
        type: 'number',
      },
      householdsImpactedIndigenous: {
        title:
          'Number of households on Indigenous lands targeted by this proposal. This value should match cell G55 in Template 1.',
        type: 'number',
      },
    },
  },
};

export default benefits;
