import { JSONSchema7 } from 'json-schema';

const benefits: Record<string, JSONSchema7> = {
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
          'Final number of Eligible Households targeted by this proposal. This value should match cell F151 in Template 1 – Eligibility Summary.',
        type: 'number',
      },
      householdsImpactedIndigenous: {
        title:
          'Number of households on Indigenous lands impacted by this proposal. This value should match cell G55 in Template 1 – Eligibility Summary.',
        type: 'number',
      },
    },
  },
};

export default benefits;
