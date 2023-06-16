import { graphql } from 'react-relay';
import { createProjectInformationMutation } from '__generated__/createProjectInformationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation createProjectInformationMutation(
    $input: CreateProjectInformationInput!
  ) {
    createProjectInformation(input: $input) {
      projectInformationData {
        id
        jsonData
        rowId
        applicationByApplicationId {
          applicationSowDataByApplicationId {
            nodes {
              id
              archivedAt
              sowTab1SBySowId {
                nodes {
                  id
                  archivedAt
                }
              }
              sowTab2SBySowId {
                nodes {
                  id
                  archivedAt
                }
              }
              sowTab7SBySowId {
                nodes {
                  id
                  archivedAt
                }
              }
              sowTab8SBySowId {
                nodes {
                  id
                  archivedAt
                }
              }
            }
          }
        }
      }
    }
  }
`;

const useCreateProjectInformationMutation = () =>
  useMutationWithErrorMessage<createProjectInformationMutation>(
    mutation,
    () => 'An error occured while attempting to create the project information'
  );

export { mutation, useCreateProjectInformationMutation };
