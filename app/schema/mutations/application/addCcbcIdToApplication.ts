import {graphql} from 'react-relay';
import { addCcbcIdToApplicationMutation } from '../../../__generated__/addCcbcIdToApplicationMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';


const mutation = graphql`
    mutation addCcbcIdToApplicationMutation($input: ApplicationsAddCcbcIdInput!){
        applicationsAddCcbcId(input: $input){
            application {
                ccbcId,
                rowId
            }
        }
    }
`

const useAddCcbcIdToApplicationMutation = () => useMutationWithErrorMessage<addCcbcIdToApplicationMutation>(
    mutation,
    () => 'An error occured while attempting to assign CCBC ID to application'
);

export {mutation, useAddCcbcIdToApplicationMutation};
