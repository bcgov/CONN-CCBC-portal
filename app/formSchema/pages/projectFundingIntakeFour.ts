import { RJSFSchema } from '@rjsf/utils';
import projectFunding from './projectFunding';

const projectFundingIntakeFour: Record<string, RJSFSchema> = {
  projectFunding: {
    ...projectFunding.projectFunding,
    required: [
      'totalFundingRequestedCCBC',
      'totalApplicantContribution',
      'applicationContribution2425',
      'applicationContribution2526',
      'applicationContribution2627',
      'fundingRequestedCCBC2425',
      'fundingRequestedCCBC2526',
      'fundingRequestedCCBC2627',
    ],
    properties: {
      ...projectFunding.projectFunding.properties,
      fundingRequestedCCBC2223: {
        title: '2022-23',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
      fundingRequestedCCBC2324: {
        title: '2023-24',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
      applicationContribution2223: {
        title: '2022-23',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
      applicationContribution2324: {
        title: '2023-24',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
    },
  },
};

export default projectFundingIntakeFour;
