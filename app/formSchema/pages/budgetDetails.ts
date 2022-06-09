const budgetDetails = {
  budgetDetails: {
    title: 'Budget details',
    type: 'object',
    properties: {
      totalEligbleCosts: {
        title: 'Total eligble costs',
        type: 'number',
      },
      totalProjectCost: {
        title: 'Total project cost',
        type: 'number',
      },
      // desgin shows
      requestedCCBCFunding: {
        title: 'Amount requested under Connecting Communities British Columbia',
        type: 'number',
      },
    },
  },
};

export default budgetDetails;
