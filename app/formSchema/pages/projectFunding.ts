const projectFunding = {
  projectFunding: {
    title: 'Project funding',
    type: 'object',
    description:
      'Please note: CCBC is funded by both British Columbia and the Government of Canada. With this one application, you are applying to funding from both partners. You are expected to enter into a separate agreement with both partners.',
    required: [
      'totalFundingRequestedCCBC',
      'totalApplicantContribution',
      'totalInfrastructureBankFunding',
    ],
    properties: {
      fundingRequestedCCBC2223: {
        title: '2022-23',
        type: 'string',
      },
      fundingRequestedCCBC2324: {
        title: '2023-24',
        type: 'string',
      },
      fundingRequestedCCBC2425: {
        title: '2024-25',
        type: 'string',
      },
      fundingRequestedCCBC2526: {
        title: '2025-26',
        type: 'string',
      },
      fundingRequestedCCBC2627: {
        title: '2026-27',
        type: 'string',
      },
      totalFundingRequestedCCBC: {
        title: 'Total amount requested under CCBC',
        type: 'string',
      },
      applicationContribution2223: {
        title: '2022-23',
        type: 'string',
      },
      applicationContribution2324: {
        title: '2023-24',
        type: 'string',
      },
      applicationContribution2425: {
        title: '2024-25',
        type: 'string',
      },
      applicationContribution2526: {
        title: '2025-26',
        type: 'string',
      },
      applicationContribution2627: {
        title: '2026-27',
        type: 'string',
      },
      totalApplicantContribution: {
        title: 'Total amount applicant will contribute',
        type: 'string',
      },
      infrastructureBankFunding2223: {
        title: '2022-23',
        type: 'string',
      },
      infrastructureBankFunding2324: {
        title: '2023-24',
        type: 'string',
      },
      infrastructureBankFunding2425: {
        title: '2024-25',
        type: 'string',
      },
      infrastructureBankFunding2526: {
        title: '2025-26',
        type: 'string',
      },
      totalInfrastructureBankFunding: {
        title: 'Total amount requested under Canadian Infrastructure Bank',
        type: 'string',
      },
    },
  },
};

export default projectFunding;
