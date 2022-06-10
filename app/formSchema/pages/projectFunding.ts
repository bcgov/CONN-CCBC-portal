const projectFunding = {
  projectFunding: {
    title: 'Project funding',
    type: 'object',
    description:
      'Please note: CCBC is funded by both British Columbia and the Government of Canada. With this one application, you are applying to funding from both partners. You are expected to enter into a separate agreement with both partners.',
    required: [
      'projectTitle',
      'geographicAreaDescription',
      'projectDescription',
    ],
    properties: {
      amountFundingRequested: {
        type: 'object',
        title: 'Amount requested under CCBC',
        properties: {
          fundingRequested2223: {
            title: '2022-23',
            type: 'string',
          },
          fundingRequested2324: {
            title: '2023-24',
            type: 'string',
          },
          fundingRequested2425: {
            title: '2024-25',
            type: 'string',
          },
          fundingRequested2526: {
            title: '2025-26',
            type: 'string',
          },
          fundingRequested2627: {
            title: '2026-27',
            type: 'string',
          },
        },
      },
    },
  },
};

export default projectFunding;
