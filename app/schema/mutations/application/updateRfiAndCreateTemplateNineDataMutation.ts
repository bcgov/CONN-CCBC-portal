import { graphql } from 'react-relay';
import { updateRfiAndCreateTemplateNineDataMutation } from '__generated__/updateRfiAndCreateTemplateNineDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateRfiAndCreateTemplateNineDataMutation(
    $rfiInput: UpdateRfiInput!
    $templateNineInput: CreateApplicationFormTemplate9DataInput!
  ) {
    updateRfi(input: $rfiInput) {
      rfiData {
        rfiNumber
        rowId
        id
      }
    }
    createApplicationFormTemplate9Data(input: $templateNineInput) {
      applicationFormTemplate9Data {
        rowId
        applicationId
      }
    }
  }
`;

const useUpdateRfiAndCreateTemplateNineDataMutation = () =>
  useMutationWithErrorMessage<updateRfiAndCreateTemplateNineDataMutation>(
    mutation,
    () =>
      'An error occurred while attempting to update the RFI with new Template Nine Data.'
  );

export { mutation, useUpdateRfiAndCreateTemplateNineDataMutation };
