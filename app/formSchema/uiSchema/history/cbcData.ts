import eventsAndDates from 'formSchema/analyst/cbc/eventsAndDates';
import funding from 'formSchema/analyst/cbc/funding';
import locations from 'formSchema/analyst/cbc/locations';
import locationsAndCounts from 'formSchema/analyst/cbc/locationsAndCounts';
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
      ...locationsAndCounts.properties,
      ...funding.properties,
      ...eventsAndDates.properties,
      ...miscellaneous.properties,
      ...projectDataReviews.properties,
    },
  },
};

export default cbcData;
