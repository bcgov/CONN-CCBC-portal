import { RJSFSchema } from '@rjsf/utils';

const funding: RJSFSchema = {
  title: 'Funding',
  description: '',
  type: 'object',
  properties: {
    bcFundingRequest: {
      type: 'number',
      title: 'BC Funding Request',
    },
    federalFunding: {
      type: 'number',
      title: 'Federal Funding',
    },
    applicantAmount: {
      type: 'number',
      title: 'Applicant Amount',
    },
    otherFunding: {
      type: 'number',
      title: 'Other Amount',
    },
    totalProjectBudget: {
      type: 'number',
      title: 'Total Project Budget',
    },
  },
};

export default funding;
