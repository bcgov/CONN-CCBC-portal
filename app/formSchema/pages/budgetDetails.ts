const budgetDetails = {
  budgetDetails: {
    title: 'Budget details',
    description:
      'The applicant must demonstrate that a funding plan is in place to implement the eligible project.',
    type: 'object',
    required: ['totalEligibleCosts', 'totalProjectCost'],
    properties: {
      totalEligibleCosts: {
        title: `The applicant must complete and upload the appropriate templates related to the project budget details in the Template Uploads section. Values here must match values in Template 2 - Detailed Budget.

          Total eligible costs`,
        type: 'number',
      },
      totalProjectCost: {
        title: 'Total project cost',
        type: 'number',
      },
    },
  },
};

export default budgetDetails;
