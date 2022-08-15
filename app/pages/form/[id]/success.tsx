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
import { dateTimeFormat } from '../../../lib/theme/functions/formatDates';

const StyledSection = styled.section`
  margin: 24px 0;
`;

const StyledDiv = styled.div`
  margin: 24px;
`;

const getSuccessQuery = graphql`
  query successQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      status
      ccbcId
      intakeId
      projectName
    }
    allIntakes {
      edges {
        node {
          ccbcIntakeNumber
          rowId
          closeTimestamp
        }
      }
    }
    session {
      sub
    }
  }
`;
// eslint-disable-next-line @typescript-eslint/ban-types
const Success = ({ preloadedQuery }: RelayProps<{}, successQuery>) => {
  const query = usePreloadedQuery(getSuccessQuery, preloadedQuery);

  const { allIntakes, applicationByRowId, session } = query;

  const getDateString = (date: Date) => {
    if (date) {
      return dateTimeFormat(date, 'date_year_first');
    }
  };
  const unwrap = (edges) => edges.map(({ node }) => node);
  const unwrapIntakes = unwrap(allIntakes.edges);
  const currentIntake = unwrapIntakes.find(
    (intake) => intake.rowId === applicationByRowId.intakeId
  );
  const projectName = applicationByRowId?.projectName;
  const ccbcIntakeNumber = currentIntake.ccbcIntakeNumber;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDiv>
        <StyledSection>
          <SuccessBanner ccbcId={applicationByRowId.ccbcId} />
          <h3>Thank you for applying to CCBC Intake {ccbcIntakeNumber}</h3>
          <div>
            We have received your application
            {projectName && ` for ${projectName}`}.
          </div>
          <div>
            You can edit this application until the intake closes on{' '}
            {getDateString(currentIntake.closeTimestamp)}
          </div>
        </StyledSection>
        <Link href="/dashboard" passHref>
          <Button>Return to dashboard</Button>
        </Link>
      </StyledDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.id?.toString()),
    };
  },
};

export default withRelay(Success, getSuccessQuery, withRelayOptions);
