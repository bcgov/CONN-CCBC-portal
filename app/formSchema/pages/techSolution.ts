const techSolution = {
  techSolution: {
    title: 'Technological solution',
    type: 'object',
    description: 'Describe your technological solution',
    properties: {
      systemDesign: {
        title:
          'System design: Provide a description of the system design which covers all key Network components that will enable improved connectivity. This description should provide sufficient detail, from the start to the end points.',
        type: 'string',
      },
      scalability: {
        title:
          'Scalability: Describe the ability of the Network to adapt to forecasted increased Network capacity and demand over the next 5 years from the Project Completion Date, accommodating additional subscribers and usage traffic, enhanced services and the Network’s ability to support speeds identified in the application guide. ',
        type: 'string',
      },
      backboneTechnology: {
        title:
          'Please specify the backbone technology type (check all that apply).',
        type: 'array',
        items: {
          type: 'boolean',
          enum: ['Fibre', 'Microwave', 'Satellite'],
        },
        uniqueItems: true,
      },
      lastMileTechnology: {
        title:
          'Please specify the last mile technology type (check all that apply). If you select fixed wireless, you must complete Template 7.',
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
