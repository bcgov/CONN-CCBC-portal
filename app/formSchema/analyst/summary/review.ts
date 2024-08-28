import { RJSFSchema } from '@rjsf/utils';
import counts from './counts';
import dependency from './dependency';
import eventsAndDates from './eventsAndDates';
import funding from './funding';
import milestone from './milestone';

const review: RJSFSchema = {
  type: 'object',
  properties: {
    dependency: {
      required: dependency.required,
      title: dependency.title,
      properties: {
        ...dependency.properties,
      },
    },
    counts: {
      required: counts.required,
      title: counts.title,
      properties: {
        ...counts.properties,
      },
    },
    funding: {
      required: funding.required,
      title: funding.title,
      properties: {
        ...funding.properties,
      },
    },
    eventsAndDates: {
      required: eventsAndDates.required,
      title: eventsAndDates.title,
      properties: {
        ...eventsAndDates.properties,
      },
    },
    milestone: {
      required: milestone.required,
      title: milestone.title,
      properties: {
        ...milestone.properties,
      },
    },
  },
};

export default review;
