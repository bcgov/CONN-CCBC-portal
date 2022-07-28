import Link from 'next/link';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import defaultRelayOptions from '../../../lib/relay/withRelayOptions';
import { usePreloadedQuery } from 'react-relay/hooks';
import Button from '@button-inc/bcgov-theme/Button';
import SuccessBanner from '../../../components/Form/SuccessBanner';
import styled from 'styled-components';
import { Layout } from '../../../components';
import { successQuery } from '../../../__generated__/successQuery.graphql';

const StyledSection = styled.section`
  margin: 24px 0;
`;

const StyledDiv = styled.div`
  margin: 24px;
`;

const getSuccessQuery = graphql`
  query successQuery {
    session {
      sub
    }
  }
`;
// eslint-disable-next-line @typescript-eslint/ban-types
const Success = ({ preloadedQuery }: RelayProps<{}, successQuery>) => {
  const { session } = usePreloadedQuery(getSuccessQuery, preloadedQuery);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDiv>
        <StyledSection>
          <SuccessBanner />
          <h3>Thank you for applying to CCBC Intake 1</h3>
          <div>We have received your application for Sudden Valley.</div>
          <div>
            You can edit this application until the intake closes on YYYY/MM/DD.
          </div>
        </StyledSection>
        <Link href="/" passHref>
          <Button>Return to dashboard</Button>
        </Link>
      </StyledDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
};

export default withRelay(Success, getSuccessQuery, withRelayOptions);
