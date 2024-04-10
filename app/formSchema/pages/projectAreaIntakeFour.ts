import { RJSFSchema } from '@rjsf/utils';
import projectArea from './projectArea';

const projectAreaIntakeFour: Record<string, RJSFSchema> = {
  projectArea: {
    title: 'Project area',
    type: 'object',
    required: [
      'geographicArea',
      'projectSpanMultipleLocations',
      'firstNationsLed',
    ],
    properties: {
      ...projectArea.projectArea.properties,
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

export default projectAreaIntakeFour;
