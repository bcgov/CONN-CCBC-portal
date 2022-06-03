import { graphql } from 'react-relay';

const getSessionQuery = graphql`
  query getSessionQuery {
    session {
      sub
    }
  }
`;

export default getSessionQuery;
