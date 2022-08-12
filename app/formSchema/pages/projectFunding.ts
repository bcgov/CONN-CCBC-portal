const projectFunding = {
  projectFunding: {
    title: 'Project funding',
    type: 'object',
    description:
      'Please note: CCBC is funded by both British Columbia and the Government of Canada. With this one application, you are applying to funding from both partners. You are expected to enter into a separate agreement with both partners.',
    required: [
      'totalFundingRequestedCCBC',
      'totalApplicantContribution',
      'applicationContribution2223',
      'applicationContribution2324',
      'applicationContribution2425',
      'applicationContribution2526',
      'applicationContribution2627',
      'fundingRequestedCCBC2223',
      'fundingRequestedCCBC2324',
      'fundingRequestedCCBC2425',
      'fundingRequestedCCBC2526',
      'fundingRequestedCCBC2627',
    ],
    properties: {
      fundingRequestedCCBC2223: {
        title: '2022-23',
        type: 'number',
      },
      fundingRequestedCCBC2324: {
        title: '2023-24',
        type: 'number',
      },
      fundingRequestedCCBC2425: {
        title: '2024-25',
        type: 'number',
      },
      fundingRequestedCCBC2526: {
        title: '2025-26',
        type: 'number',
      },
      fundingRequestedCCBC2627: {
        title: '2026-27',
        type: 'number',
      },
      totalFundingRequestedCCBC: {
        title: 'Total amount requested under CCBC',
        type: 'number',
      },
      applicationContribution2223: {
        title: '2022-23',
        type: 'number',
      },
      applicationContribution2324: {
        title: '2023-24',
        type: 'number',
      },
      applicationContribution2425: {
        title: '2024-25',
        type: 'number',
      },
      applicationContribution2526: {
        title: '2025-26',
        type: 'number',
      },
      applicationContribution2627: {
        title: '2026-27',
        type: 'number',
      },
      totalApplicantContribution: {
        title: 'Total amount Applicant will contribute',
        type: 'number',
      },
      infrastructureBankFunding2223: {
        title: '2022-23',
        type: 'number',
      },
      infrastructureBankFunding2324: {
        title: '2023-24',
        type: 'number',
      },
      infrastructureBankFunding2425: {
        title: '2024-25',
        type: 'number',
      },
      infrastructureBankFunding2526: {
        title: '2025-26',
        type: 'number',
      },
      totalInfrastructureBankFunding: {
        title: 'Total amount requested under Canadian Infrastructure Bank',
        type: 'number',
      },
    },
  },
};

export default projectFunding;
