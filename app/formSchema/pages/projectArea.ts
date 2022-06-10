const projectArea = {
  projectArea: {
    title: 'Project area',
    description: 'Please describe the geographic area of the proposed project',
    type: 'object',
    required: ['geographicArea', 'projectSpanMultipleLocations'],
    properties: {
      geographicArea: {
        title:
          'Referring to the project zones shown in the application guide, which zone(s) will this project be conducted in?',
        type: 'array',
        items: {
          type: 'boolean',
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        uniqueItems: true,
      },
      projectSpanMultipleLocations: {
        title: 'Does your project span multiple provinces/territories?',
        type: 'boolean',
        enum: ['Yes', 'No'],
      },
    },
    dependencies: {
      projectSpanMultipleLocations: {
        oneOf: [
          {
            properties: {
              projectSpanMultipleLocations: {
                enum: ['No'],
              },
            },
          },
          {
            properties: {
              projectSpanMultipleLocations: {
                enum: ['Yes'],
              },
              provincesTerritories: {
                title:
                  'If yes, select the provinces or territorities (check all that apply):',
                type: 'array',
                items: {
                  type: 'boolean',
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
