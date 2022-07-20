const projectPlan = {
  projectPlan: {
    title: 'Project planning and management',
    type: 'object',
    description:
      'An Applicant must demonstrate capacity including administrative and technical capabilities to manage the proposed Project and bring it to successful completion.',
    required: ['projectStartDate', 'projectCompletionDate', 'operationalPlan'],
    properties: {
      projectStartDate: {
        title: 'Project Start Date (YYYY/MM/DD)',
        type: 'string',
      },
      projectCompletionDate: {
        title:
          'Completion Date (YYYY/MM/DD). This determines whether the Project meets the timeframe of the CCBC Program and to compare projects proposing to serve the same general underserved area.',
        type: 'string',
      },
      relationshipManagerApplicant: {
        title:
          'Please describe the relationship between the Project manager and the Applicant.',
        type: 'string',
      },
      overviewProjectManagementTeam: {
        title:
          'Overview of Project management team – Please identify the Applicant’s Project lead and team members including name, title, roles and responsibilities and relevant experience.',
        type: 'string',
      },
      overviewOfProjectParticipants: {
        title:
          'Overview of Project participants – Please identify the Applicant’s Project participants including builder(s), owner(s) and operator(s) if different. Please indicate the names, titles, operating name (if applicable), legal type, contact information and relevant portion of the Network. Applicant and collaborators must have strong project management, financial control and technical development skills.',
        type: 'string',
      },
      operationalPlan: {
        title:
          'Operational Plan – Describe key factors to indicate how the Applicant will be prepared to operate, manage and maintain the proposed broadband Network including any external managed services which will support Network management or operations functions. Address how the Applicant will ensure that the necessary sales, operational, technical and billing support systems are or will be in place to supply the proposed services.',
        type: 'string',
      },
    },
  },
};

export default projectPlan;
