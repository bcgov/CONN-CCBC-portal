const acknowledgements = {
  acknowledgements: {
    title: 'Acknowledgements',
    description:
      'By checking the boxes below the Applicant certifies and acknowledges, that:',
    type: 'object',
    required: ['acknowledgementsList'],
    properties: {
      acknowledgementsList: {
        type: 'array',
        items: {
          type: 'boolean',
          enum: [
            `The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.`,
            `The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.`,
            `The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.`,
            `The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).`,
            `The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.`,
            `The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.`,
            `The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.`,
            `The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.`,
            `The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.`,
            `The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.`,
            `The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.`,
            `The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.`,
            `The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.`,
            `The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.`,
            `The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.`,
            `The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.`,
            `The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission.`,
          ],
        },
        uniqueItems: true,
      },
    },
  },
};

export default acknowledgements;
