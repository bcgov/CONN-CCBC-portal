const projectPlan = {
  projectPlan: {
    title: 'Project planning and management',
    type: 'object',
    description:
      'An applicant must demonstrate capacity including administrative and technical capabilities to manage the proposed project and bring it to successful completion.',
    required: ['projectStartDate', 'projectCompletionDate', 'operationalPlan'],
    properties: {
      projectStartDate: {
        title: 'Project Start Date (YYYY/MM/DD)',
        type: 'string',
      },
      projectCompletionDate: {
        title:
          'Completion Date (YYYY/MM/DD). This determines whether the project meets the timeframe of the CCBC program and to compare projects proposing to serve the same general underserved area.',
        type: 'string',
      },
      relationshipManagerApplicant: {
        title:
          'Please describe the relationship between the project manager and the applicant.',
        type: 'string',
      },
      overviewOfProjectParticipants: {
        title:
          'Overview of project participants – Please identify the applicant’s project participants including builder(s), owner(s) and operator(s) if different. Please indicate the names, titles, operating name (if applicable), legal type, contact information and relevant portion of the network. Applicant and collaborators must have strong project management, financial control and technical development skills.',
        type: 'string',
      },
      operationalPlan: {
        title:
          'Operational Plan – Describe key factors to indicate how the applicant will be prepared to operate, manage and maintain the proposed broadband network including any external managed services which will support network management or operations functions. Address how the applicant will ensure that the necessary sales, operational, technical and billing support systems are or will be in place to supply the proposed services.',
        type: 'string',
      },
    },
  },
};

export default projectPlan;
