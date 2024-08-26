import { RJSFSchema } from '@rjsf/utils';

const budgetDetails: Record<string, RJSFSchema> = {
  budgetDetails: {
    title: 'Budget details',
    description:
      'The Applicant must demonstrate that a funding plan is in place to implement the eligible Project.',
    type: 'object',
    required: ['totalEligibleCosts', 'totalProjectCost'],
    properties: {
      totalEligibleCosts: {
        title: `The Applicant must complete and upload the appropriate templates related to the Project Budget details in the Template Uploads section. Values here must match values in Template 2 - Detailed Budget.

          Total eligible costs is auto-filled from Template 2 - cell H27 in the Detailed Budget, including all related RFIs.`,
        type: 'number',
      },
      totalProjectCost: {
        title:
          'Total project costs is auto-filled from Template 2 - cell H28 in the Detailed Budget, including all related RFIs.',
        type: 'number',
      },
    },
  },
};

export default budgetDetails;
