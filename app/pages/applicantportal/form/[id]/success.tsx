import Link from 'next/link';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery, graphql } from 'react-relay';
import Button from '@button-inc/bcgov-theme/Button';
import styled from 'styled-components';
import SuccessBanner from '../../../../components/Form/SuccessBanner';
import defaultRelayOptions from '../../../../lib/relay/withRelayOptions';
import { Layout } from '../../../../components';
import { successQuery } from '../../../../__generated__/successQuery.graphql';
import { dateTimeFormat } from '../../../../lib/theme/functions/formatDates';

const StyledSection = styled.section`
  margin: 24px 0;
`;

const StyledDiv = styled.div`
  margin: 24px;
  min-width: 100%;
`;

const getSuccessQuery = graphql`
  query successQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      status
      ccbcNumber
      projectName
      updatedAt
      intakeByIntakeId {
        ccbcIntakeNumber
        closeTimestamp
        rollingIntake
      }
    }

    session {
      sub
    }
  }
`;
const Success = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, successQuery>) => {
  const query = usePreloadedQuery(getSuccessQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  const getDateString = (date: Date) => {
    if (date) {
      return dateTimeFormat(date, 'date_year_first');
    }
    return null;
  };

  const getTimeString = (date: Date) => {
    if (date) {
      return dateTimeFormat(date, 'minutes_time_only');
    }
    return null;
  };

  const projectName = applicationByRowId?.projectName;
  const {
    ccbcIntakeNumber,
    closeTimestamp,
    rollingIntake = false,
  } = applicationByRowId?.intakeByIntakeId || {};

  const dateUpdatedAt =
    typeof applicationByRowId.updatedAt === 'string'
      ? new Date(applicationByRowId.updatedAt)
      : applicationByRowId.updatedAt;

  const dateCloseTimestamp =
    typeof closeTimestamp === 'string'
      ? new Date(closeTimestamp)
      : closeTimestamp;

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledDiv>
        <StyledSection>
          <SuccessBanner ccbcNumber={applicationByRowId.ccbcNumber} />
          <h3>Thank you for applying to CCBC Intake {ccbcIntakeNumber}</h3>
          <div>
            The application
            <i>{projectName && `, ${projectName},`}</i> was submitted on
            {` ${getDateString(dateUpdatedAt)}`} at{' '}
            {` ${getTimeString(dateUpdatedAt)}`}.
          </div>
          {!rollingIntake && (
            <div>
              You can edit this application until the intake closes on{' '}
              {getDateString(dateCloseTimestamp)}
            </div>
          )}
        </StyledSection>
        <Link href="/applicantportal/dashboard" passHref>
          <Button>Return to dashboard</Button>
        </Link>
      </StyledDiv>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => ({
    rowId: parseInt(ctx.query.id?.toString(), 10),
  }),
};

export default withRelay(Success, getSuccessQuery, withRelayOptions);
