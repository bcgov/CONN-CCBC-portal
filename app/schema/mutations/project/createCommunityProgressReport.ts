import { graphql } from 'react-relay';
import { createCommunityProgressReportMutation } from '__generated__/createCommunityProgressReportMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createCommunityProgressReportMutation(
    $input: CreateApplicationCommunityProgressReportDataInput!
  ) {
    createApplicationCommunityProgressReportData(input: $input) {
      applicationCommunityProgressReportData {
        id
        jsonData
        rowId
      }
    }
  }
`;

const useCreateCommunityProgressReportMutation = () =>
  useMutationWithErrorMessage<createCommunityProgressReportMutation>(
    mutation,
    () =>
      'An error occurred while attempting to create the community progress report'
  );

export { mutation, useCreateCommunityProgressReportMutation };
