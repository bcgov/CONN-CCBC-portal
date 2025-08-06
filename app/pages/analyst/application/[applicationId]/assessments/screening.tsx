import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { screeningAssessmentQuery } from '__generated__/screeningAssessmentQuery.graphql';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import screening from 'formSchema/analyst/screening';
import GuideLink from 'components/Analyst/GuideLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Link from 'next/link';
import { CCBC_ELIGIBILITY_SCREENING_TEMPLATE } from 'data/externalConstants';

const StyledInfoBarDiv = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.medium};
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// replace with slug later with tabs
const getScreeningAssessmentQuery = graphql`
  query screeningAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_assessmentDataType: "screening") {
        jsonData
      }
      ccbcNumber
    }
    session {
      sub
    }
    ...AnalystSelectWidget_query
    ...AnalystLayout_query
  }
`;

const ScreeningAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, screeningAssessmentQuery>) => {
  const query = usePreloadedQuery(getScreeningAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  return (
    <Layout
      session={session}
      title="Connecting Communities BC"
      provisionRightNav
    >
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <StyledInfoBarDiv>
          <GuideLink />
          <StyledLink href={CCBC_ELIGIBILITY_SCREENING_TEMPLATE}>
            <FontAwesomeIcon icon={faFileLines} /> CCBC_Eligibility Screening
            Template.xlsm
          </StyledLink>
        </StyledInfoBarDiv>
        <AssessmentsForm
          addedContext={{ ccbcNumber: applicationByRowId.ccbcNumber }}
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={screening}
          slug="screening"
          query={query}
        />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(
  ScreeningAssessment,
  getScreeningAssessmentQuery,
  withRelayOptions
);
