import { graphql } from 'react-relay';
import { updateFormRfiAndCreateTemplateNineDataMutation } from '__generated__/updateFormRfiAndCreateTemplateNineDataMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation updateFormRfiAndCreateTemplateNineDataMutation(
    $rfiInput: UpdateRfiInput!
    $templateNineInput: CreateApplicationFormTemplate9DataInput!
    $formInput: CreateNewFormDataInput!
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
    createNewFormData(input: $formInput) {
      formData {
        jsonData
      }
    }
  }
`;

const useUpdateFormRfiAndCreateTemplateNineDataMutation = () =>
  useMutationWithErrorMessage<updateFormRfiAndCreateTemplateNineDataMutation>(
    mutation,
    () => 'An error occurred while attempting to create the application.'
  );

export { mutation, useUpdateFormRfiAndCreateTemplateNineDataMutation };
