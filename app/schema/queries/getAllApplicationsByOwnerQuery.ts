import { graphql } from 'react-relay';

const getAllApplicationsByOwnerQuery = graphql`
  query getAllApplicationsByOwnerQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner, orderBy: UPDATED_AT_DESC) {
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
