import { graphql } from 'react-relay';

const getAllApplicationsByOwnerQuery = graphql`
  query getAllApplicationsByOwnerQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner) {
      nodes {
        id
        rowId
        owner
        referenceNumber
        status
        projectName
      }
    }
  }
`;

export default getAllApplicationsByOwnerQuery;
