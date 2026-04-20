import { RJSFSchema } from '@rjsf/utils';
import projectFunding from './projectFunding';

const projectFundingIntakeFour: Record<string, RJSFSchema> = {
  projectFunding: {
    ...projectFunding.projectFunding,
    required: [
      'totalFundingRequestedCCBC',
      'totalApplicantContribution',
      'applicationContribution2526',
      'applicationContribution2627',
      'applicationContribution2728',
      'applicationContribution2829',
      'fundingRequestedCCBC2526',
      'fundingRequestedCCBC2627',
      'fundingRequestedCCBC2728',
      'fundingRequestedCCBC2829',
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
      fundingRequestedCCBC2425: {
        title: '2024-25',
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
      applicationContribution2425: {
        title: '2024-25',
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
    },
  },
};

export default projectFundingIntakeFour;
