import { RJSFSchema } from '@rjsf/utils';
import cbcTombstone from './tombstone';
import projectType from './projectType';
import locationsAndCounts from './locationsAndCounts';
import funding from './funding';
import eventsAndDates from './eventsAndDates';
import miscellaneous from './miscellaneous';
import projectDataReviews from './projectDataReviews';

const review: RJSFSchema = {
  type: 'object',
  properties: {
    tombstone: {
      required: cbcTombstone.required,
      title: cbcTombstone.title,
      properties: {
        ...cbcTombstone.properties,
      },
    },
    projectType: {
      required: projectType.required,
      title: projectType.title,
      properties: {
        ...projectType.properties,
      },
    },
    locationsAndCounts: {
      required: locationsAndCounts.required,
      title: locationsAndCounts.title,
      properties: {
        ...locationsAndCounts.properties,
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
    miscellaneous: {
      title: miscellaneous.title,
      properties: {
        ...miscellaneous.properties,
      },
    },
    projectDataReviews: {
      title: projectDataReviews.title,
      properties: {
        ...projectDataReviews.properties,
      },
    },
  },
};

export default review;
