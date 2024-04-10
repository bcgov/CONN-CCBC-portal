import { RJSFSchema } from '@rjsf/utils';
import projectArea from './projectArea';

const projectAreaIntakeFour: Record<string, RJSFSchema> = {
  projectArea: {
    ...projectArea.projectArea,
    required: [
      'geographicArea',
      'projectSpanMultipleLocations',
      'firstNationsLed',
    ],
  },
};

export default projectAreaIntakeFour;
