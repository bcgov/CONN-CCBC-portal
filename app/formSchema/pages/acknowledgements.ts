const acknowledgements = {
  acknowledgements: {
    title: 'Acknowledgements',
    description:
      'By checking the boxes below the Applicant certifies and acknowledges, that:',
    type: 'object',
    required: ['declarationsList'],
    properties: {
      acknowledgementsList: {
        type: 'array',
        items: {
          type: 'boolean',
          enum: [
            `The Applicant confirms that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which
          could or would affect its ability to implement this proposed Project.`,
            `The Applicant confirms that it authorizes the Program to make enquiries of such persons, firms, corporations, federal and provincial government
          agencies/departments and non-profit organizations, to collect and share with them, as the Program deems necessary in order to reach a decision
          on this proposed Project.`,
            `The Applicant confirms that any person, who is required to be registered pursuant to the Lobbying Act including consultant and in-house lobbyists,
            is registered pursuant to that Act, and is in compliance with the provisions of the Act.`,
            `The Applicant recognizes that the Project may require an impact assessment under the Impact Assessment Act 2019.`,
            `The Applicant recognizes that there is a duty to consult Indigenous groups if a federally funded Project will undertake infrastructure in, or affecting,
            an Indigenous community.`,
            `The Applicant confirms that any former public officer holder or public servant employed by the Applicant is in compliance with the provisions of the
            Values and Ethics Code for the Public Service, the Policy on Conflict of Interest and Post-Employment and the Conflict of Interest Act.`,
            `The Applicant understands that all costs incurred in the preparation and submission of the proposal shall be wholly absorbed by the Applicant.`,
            `The Applicant understands that the Program reserves the right to make partial awards and to negotiate Project scope changes with Applicants.`,
            `The Applicant understands that the Program is a discretionary program subject to available funding and that submission of a complete application,
            meeting any or all of the assessment criteria, does not mean that funding will be granted. All Applicants whose Projects are approved for funding
            will be notified in writing.`,
            `The Applicant confirms that it is and will remain in compliance with any applicable Canadian national security requirements as defined and/or
            administered by the Canadian security authorities.`,
            `The Applicant confirms that it has the managing capability to deliver the Project on time and on budget.`,
            `The Applicant confirms that it is requesting the lowest possible contribution amount required to make this Project financially viable.`,
            `The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may
            affect its eligibility and funding approval may be revoked.`,
            `The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct.`,
            `The Applicant agrees that information provided in this Application Form (including attachments) may be shared with the Government of Canada and other levels of government to promote the Program and maximize the benefits to citizens.`,
          ],
        },
        uniqueItems: true,
      },
    },
  },
};

export default acknowledgements;
