const projectArea = {
  projectArea: {
    title: 'project area',
    description: 'Please describe the geographic area of the proposed project',
    type: 'object',
    properties: {
      projectSpanMultipleLocations: {
        title:
          'Referring to the project zones shown in the application guide, which zone(s) will this project be conducted in?',
        type: 'array',
        items: {
          type: 'boolean',
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        uniqueItems: true,
      },
      projectLocations: {
        title: 'If yes, province or territory location (check all that apply)',
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'Alberta',
            'British Columbia',
            'Northwest Territories',
            'Yukon',
          ],
        },
        uniqueItems: true,
      },
    },
  },
};

export default projectArea;
