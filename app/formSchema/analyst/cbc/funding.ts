import { RJSFSchema } from '@rjsf/utils';

const funding: RJSFSchema = {
  title: 'Funding',
  description: '',
  type: 'object',
  properties: {
    bcFundingRequested: {
      type: 'number',
      title: 'BC Funding Request',
    },
    federalFundingRequested: {
      type: 'number',
      title: 'Federal Funding',
    },
    applicantAmount: {
      type: 'number',
      title: 'Applicant Amount',
    },
    otherFundingRequested: {
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
