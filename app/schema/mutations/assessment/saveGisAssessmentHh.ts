import { graphql } from 'react-relay';
import { saveGisAssessmentHhMutation } from '__generated__/saveGisAssessmentHhMutation.graphql';
import useDebouncedMutation from '../useDebouncedMutation';

const mutation = graphql`
  mutation saveGisAssessmentHhMutation($input: SaveGisAssessmentHhInput!) {
    saveGisAssessmentHh(input: $input) {
      applicationGisAssessmentHh {
        applicationId
        eligible
        eligibleIndigenous
        id
        rowId
      }
    }
  }
`;

const useSaveGisAssessmentHhMutation = () =>
  useDebouncedMutation<saveGisAssessmentHhMutation>(
    mutation,
    () => 'An error occured while attempting to create the screening assessment'
  );

export { mutation, useSaveGisAssessmentHhMutation };
