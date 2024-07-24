import { RJSFSchema } from '@rjsf/utils';

const funding: RJSFSchema = {
  title: 'Funding',
  description: '',
  type: 'object',
  required: [
    'bcFundingRequested',
    'federalFunding',
    'applicantAmount',
    'cibFunding',
    'fhnaFunding',
    'otherFunding',
    'totalProjectBudget',
  ],
  properties: {
    bcFundingRequested: {
      type: 'number',
      title: 'BC Funding Requested',
    },
    federalFunding: {
      type: 'number',
      title: 'Federal Funding',
    },
    applicantAmount: {
      type: 'number',
      title: 'Applicant Amount',
    },
    cibFunding: {
      type: 'number',
      title: 'CIB Funding',
    },
    fhnaFunding: {
      type: 'number',
      title: 'FHNA Funding',
    },
    otherFunding: {
      type: 'number',
      title: 'Other Funding',
    },
    totalProjectBudget: {
      type: 'number',
      title: 'Total Project Budget',
    },
  },
};

export default funding;
