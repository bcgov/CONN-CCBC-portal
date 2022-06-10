const projectInformation = {
  projectInformation: {
    title: 'Project information',
    description:
      'PLEASE NOTE: If the project is approved, the project information herein may be used, in whole or in part, in publicly accessible websites, media releases, or other similar material.',
    type: 'object',
    properties: {
      projectSpanMultipleLocations: {
        title: 'Does your project span multiple provinces/territories?',
        type: 'boolean',
        enum: [true, false],
        enumNames: ['Yes', 'No'],
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

export default projectInformation;
