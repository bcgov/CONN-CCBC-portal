import { RJSFSchema } from '@rjsf/utils';

const projectArea: Record<string, RJSFSchema> = {
  projectArea: {
    title: 'Project area',
    type: 'object',
    required: ['geographicArea', 'projectSpanMultipleLocations'],
    properties: {
      acceptedGeographicArea: {
        title: '',
        type: 'string',
      },
      firstNationsLed: {
        title: 'Is this project supported or led by one or more First Nations?',
        type: 'boolean',
        enum: [true, false],
      },
      geographicArea: {
        title:
          'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?',
        type: 'array',
        minItems: 1,
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
      projectZoneMap: {
        type: 'string',
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
                  'If yes, select the provinces or territories (check all that apply):',
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
