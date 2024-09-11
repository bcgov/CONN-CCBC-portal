import dependencyUiSchema from './dependencyUiSchema';
import countsUiSchema from './countsUiSchema';
import fundingUiSchema from './fundingUiSchema';
import eventsAndDatesUiSchema from './eventsAndDatesUiSchema';
import milestoneUiSchema from './milestoneUiSchema';
import locationsUiSchema from './locationsUiSchema';

const reviewUiSchema = {
  dependency: dependencyUiSchema,
  counts: countsUiSchema,
  locations: locationsUiSchema,
  funding: fundingUiSchema,
  eventsAndDates: eventsAndDatesUiSchema,
  milestone: milestoneUiSchema,
};
export default reviewUiSchema;
