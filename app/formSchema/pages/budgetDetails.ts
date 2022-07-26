const budgetDetails = {
  budgetDetails: {
    title: 'Budget details',
    description:
      'The Applicant must demonstrate that a funding plan is in place to implement the eligible Project.',
    type: 'object',
    required: ['totalEligibleCosts', 'totalProjectCost'],
    properties: {
      totalEligibleCosts: {
        title: `The Applicant must complete and upload the appropriate templates related to the Project Budget details in the Template Uploads section. Values here must match values in Template 2 - Detailed Budget.

          Total eligible costs (Template 2 - cell H27)`,
        type: 'number',
      },
      totalProjectCost: {
        title: 'Total project cost (Template 2 - cell H28)',
        type: 'number',
      },
    },
  },
};

export default budgetDetails;
