const techSolution = {
  techSolution: {
    title: 'Technological solution',
    type: 'object',
    description: 'Describe your technological solution',
    properties: {
      systemDesign: {
        title:
          'System design: Provide a description of the system design which covers all key network components that will enable improved connectivity. This description should provide sufficient detail, from the start to the end points.',
        type: 'string',
      },
      scalability: {
        title:
          'Scalability: Describe the ability of the network to adapt to forecasted increased network capacity and demand over the next 5 years from the project completion date, accommodating additional subscribers and usage traffic, enhanced services and the network’s ability to support speeds identified in the application guide. ',
        type: 'string',
      },
      backboneTechnology: {
        title:
          'Please specify the backbone technology type (check all that apply):',
        type: 'array',
        items: {
          type: 'boolean',
          enum: ['Fibre', 'Microwave', 'Satellite'],
        },
        uniqueItems: true,
      },
      lastMileTechnology: {
        title:
          'Please specify the last mile technology type (check all that apply):',
        type: 'array',
        items: {
          type: 'boolean',
          enum: ['Fibre', 'Cable', 'DSL', 'Fixed wireless'],
        },
        uniqueItems: true,
      },
    },
  },
};

export default techSolution;
