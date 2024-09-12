import eventsAndDates from 'formSchema/analyst/cbc/eventsAndDates';
import funding from 'formSchema/analyst/cbc/funding';
import locations from 'formSchema/analyst/cbc/locations';
import miscellaneous from 'formSchema/analyst/cbc/miscellaneous';
import projectDataReviews from 'formSchema/analyst/cbc/projectDataReviews';
import projectType from 'formSchema/analyst/cbc/projectType';
import cbcTombstone from 'formSchema/analyst/cbc/tombstone';

const cbcData = {
  cbcData: {
    properties: {
      ...cbcTombstone.properties,
      ...projectType.properties,
      ...locations.properties,
      communitiesAndLocalesCount: {
        type: 'string',
        title: 'Communities and locales count',
      },
      indigenousCommunities: {
        type: 'string',
        title: 'Indigenous Communities',
      },
      householdCount: {
        type: 'string',
        title: 'Household count',
      },
      transportKm: {
        type: 'string',
        title: 'Transport km',
      },
      highwayKm: {
        type: 'string',
        title: 'Highway km',
      },
      restAreas: {
        type: 'string',
        title: 'Rest areas',
      },
      ...funding.properties,
      ...eventsAndDates.properties,
      ...{
        ...miscellaneous.properties,
        projectMilestoneCompleted: {
          type: 'string',
          title: '% Project Milestone Completed',
        },
      },
      ...projectDataReviews.properties,
      projectStatus: {
        title: 'Project Status',
      },
      projectDescription: {
        title: 'Project Description',
      },
      project_number: {
        title: 'Project Number',
      },
    },
  },
};

export default cbcData;
