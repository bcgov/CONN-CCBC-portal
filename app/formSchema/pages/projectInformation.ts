import { JSONSchema7 } from 'json-schema';

const projectInformation: Record<string, JSONSchema7> = {
  projectInformation: {
    title: 'Project information',
    type: 'object',
    description:
      'For successful applicants receiving funding under CCBC, the contribution amounts will be made public via government websites, media releases or other similar materials. Information provided in the application may be used, in whole or in part to assist the Province of BC and ISED in the preparation of any public announcements.',
    required: [
      'projectTitle',
      'geographicAreaDescription',
      'projectDescription',
    ],
    properties: {
      projectTitle: {
        title: 'Project title',
        type: 'string',
      },
      geographicAreaDescription: {
        title: 'Geographic area description',
        type: 'string',
      },

      projectDescription: {
        title: 'Project description',
        type: 'string',
      },
    },
  },
};

export default projectInformation;
