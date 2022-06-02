import { LoginForm } from '../components';
import { graphql, usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from '../lib/relay/withRelayOptions';
import { pagesQuery } from '../__generated__/pagesQuery.graphql';
import { useLazyLoadQuery } from 'react-relay';

const HomeQuery = graphql`
  query pagesQuery {
    session {
      sub
    }
  }
`;

const Home = ({ preloadedQuery }: RelayProps<pagesQuery>) => {
  const { query } = usePreloadedQuery(HomeQuery, preloadedQuery);
  const session: any = useLazyLoadQuery(HomeQuery, {});
  console.log(session);

  return (
    <div>
      <h1>Welcome</h1>
      <p>General information:</p>
      <ul>
        <li>Please read the Application Guide.</li>
        <li>Please fill out all templates before completing application</li>
        <li>
          Applicants can apply for multiple projects and technology types but
          must demonstrate the required qualifications for each.
        </li>
      </ul>
      <p>
        To begin the application, please log in with BCeID Business. If you do
        not have BCeID Business, please use your BCeID Basic.
      </p>
      <LoginForm />
    </div>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  serverSideProps: async (ctx) => {
    const props = await defaultRelayOptions.serverSideProps(ctx);
    return props;

    return {
      redirect: {
        destination: `/`,
      },
    };
  },
};

export default withRelay(Home, HomeQuery, withRelayOptions);
// export default Home;
