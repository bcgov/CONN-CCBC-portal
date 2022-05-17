import { graphql } from 'react-relay';

const getApplicationByOwnerQuery = graphql`
  query getApplicationByOwnerQuery($owner: UUID!) {
    applicationByOwner(owner: $owner) {
      formData
      id
      owner
      referenceNumber
      status
    }
  }
`;

export default getApplicationByOwnerQuery;
