import { RJSFSchema } from '@rjsf/utils';

const benefits: Record<string, RJSFSchema> = {
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
          'Final number of Eligible Households targeted by this proposal is auto-filled from Template 1 cell F151 in the Eligibility Summary, including all related RFIs.',
        type: 'number',
        maximum: 100000,
      },
      householdsImpactedIndigenous: {
        title:
          'Number of households on Indigenous lands impacted by this proposal is auto-filled from Template 1 cell G55 in the Eligibility Summary, including all related RFIs.',
        type: 'number',
        maximum: 100000,
      },
    },
  },
};

export default benefits;
