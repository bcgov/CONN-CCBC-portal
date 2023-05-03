import { graphql } from 'react-relay';
import { parseGisAnalysisMutation } from '__generated__/parseGisAnalysisMutation.graphql';
import useMutationWithErrorMessage from '../useMutationWithErrorMessage';

const mutation = graphql`
  mutation parseGisAnalysisMutation($input: ParseGisDataInput!) {
    parseGisData(input: $input) {
      string
    }
  }
`;

const useParseGisAnalysisMutation = () =>
  useMutationWithErrorMessage<parseGisAnalysisMutation>(
    mutation,
    () => 'An error occured while attempting to parse the GIS data'
  );

export { mutation, useParseGisAnalysisMutation };
