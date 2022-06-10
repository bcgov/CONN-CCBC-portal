const additionalProjectInformation = {
  additionalProjectInformation: {
    title: 'Project information',
    type: 'object',
    properties: {
      projectTitle: {
        title: 'Project title',
        type: 'string',
      },
      geographicAreaDescription: {
        title: 'Geographic project area description',
        type: 'string',
      },
      projectDescription: {
        title:
          'Using non-technical language, provide a description of the project, its key elements, objectives, and benefits',
        type: 'string',
      },
    },
  },
};

export default additionalProjectInformation;
