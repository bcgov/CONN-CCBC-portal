const budgetDetails = {
  budgetDetails: {
    title: 'Budget details',
    description:
      'The applicant must demonstrate that a funding plan is in place to implement the eligible project.',
    type: 'object',
    required: ['totalEligibleCosts', 'totalProjectCost'],
    properties: {
      totalEligibleCosts: {
        title: `The applicant must complete and upload the appropriate templates related to the project budget details in Section 3. Template Uploads of the application submission. Values here must match Template 2 - Detailed Budget in Section 2. Template Uploads.

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
