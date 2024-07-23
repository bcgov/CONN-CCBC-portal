import { RJSFSchema } from '@rjsf/utils';

const funding: RJSFSchema = {
  title: 'Funding',
  description: '',
  type: 'object',
  required: ['bcFundingRequest', 'applicantAmount', 'totalProjectBudget'],
  properties: {
    bcFundingRequested: {
      type: 'number',
      title: 'BC Funding Requested',
    },
    federalFundingRequested: {
      type: 'number',
      title: 'Federal Funding Requested',
    },
    applicantAmount: {
      type: 'number',
      title: 'Applicant Amount',
    },
    otherFundingRequested: {
      type: 'number',
      title: 'Other Funding Requested',
    },
    totalProjectBudget: {
      type: 'number',
      title: 'Total Project Budget',
    },
  },
};

export default funding;
