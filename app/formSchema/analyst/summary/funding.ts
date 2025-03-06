import { RJSFSchema } from '@rjsf/utils';

const funding: RJSFSchema = {
  title: 'Funding',
  description: '',
  type: 'object',
  required: [
    'bcFundingRequested',
    'federalFunding',
    'applicantAmount',
    'otherFunding',
    'cibFunding',
    'fhnaFunding',
    'totalProjectBudget',
  ],
  properties: {
    bcFundingRequested: {
      type: 'number',
      title: 'BC Funding Requested',
    },
    fnhaContribution: {
      type: 'number',
      title: 'FNHA Contribution',
    },
    federalFunding: {
      type: 'number',
      title: 'Federal Funding',
    },
    fundingRequestedCcbc: {
      type: 'number',
      title: 'Total amount requested from CCBC',
    },
    applicantAmount: {
      type: 'number',
      title: 'Applicant Amount',
    },
    otherFunding: {
      type: 'number',
      title: 'Other Funding',
    },
    cibFunding: {
      type: 'number',
      title: 'CIB Funding',
    },
    fhnaFunding: {
      type: 'number',
      title: 'FNHA Funding',
    },
    totalProjectBudget: {
      type: 'number',
      title: 'Total Project Budget',
    },
  },
};

export default funding;
