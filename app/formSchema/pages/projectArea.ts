const projectArea = {
  projectArea: {
    title: 'Project area',
    description: 'Please describe the geographic area of the proposed Project',
    type: 'object',
    required: ['geographicArea', 'projectSpanMultipleLocations'],
    properties: {
      geographicArea: {
        title:
          'Referring to the Project Zones shown in the application guide, which zone(s) will this Project be conducted in?',
        type: 'array',
        items: {
          type: 'number',
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        uniqueItems: true,
      },
      projectSpanMultipleLocations: {
        title: 'Does your Project span multiple provinces/territories?',
        type: 'boolean',
        enum: [true, false],
      },
    },
    dependencies: {
      projectSpanMultipleLocations: {
        oneOf: [
          {
            properties: {
              projectSpanMultipleLocations: {
                enum: [false],
              },
            },
          },
          {
            properties: {
              projectSpanMultipleLocations: {
                enum: [true],
              },
              provincesTerritories: {
                title:
                  'If yes, select the provinces or territorities (check all that apply):',
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['Alberta', 'Northwest Territories', 'Yukon'],
                },
                uniqueItems: true,
              },
            },
            required: ['provincesTerritories'],
          },
        ],
      },
    },
  },
};

export default projectArea;
