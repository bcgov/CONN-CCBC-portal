import { graphql } from 'react-relay';

const getAllApplicationsByOwnerQuery = graphql`
  query getAllApplicationsByOwnerQuery($formOwner: ApplicationCondition!) {
    allApplications(condition: $formOwner, orderBy: UPDATED_AT_DESC) {
      nodes {
        id
        rowId
        createdBy
        referenceNumber
        status
        projectName
        ccbcId
      }
    }
  }
`;

export default getAllApplicationsByOwnerQuery;
