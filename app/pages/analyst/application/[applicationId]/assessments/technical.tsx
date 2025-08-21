import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import technical from 'formSchema/analyst/technical';
import { technicalAssessmentQuery } from '__generated__/technicalAssessmentQuery.graphql';
import GuideLink from 'components/Analyst/GuideLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Link from 'next/link';
import { CCBC_TECH_ESSENTIALS_TEMPLATE } from 'data/externalConstants';

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

const getTechnicalAssessmentQuery = graphql`
  query technicalAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_assessmentDataType: "technical") {
        jsonData
      }
      applicationDependenciesByApplicationId(first: 1) {
        nodes {
          jsonData
        }
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

const TechnicalAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, technicalAssessmentQuery>) => {
  const query = usePreloadedQuery(getTechnicalAssessmentQuery, preloadedQuery);

  const { applicationByRowId, session } = query;

  const formData = {
    ...applicationByRowId.assessmentForm?.jsonData,
    ...applicationByRowId.applicationDependenciesByApplicationId.nodes[0]
      ?.jsonData,
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <AssessmentsTabs />
        <StyledInfoBarDiv>
          <GuideLink />
          <StyledLink href={CCBC_TECH_ESSENTIALS_TEMPLATE}>
            <FontAwesomeIcon icon={faFileLines} /> CCBC_Tech Essentials
            Template.xlsm
          </StyledLink>
        </StyledInfoBarDiv>
        <AssessmentsForm
          addedContext={{ ccbcNumber: applicationByRowId.ccbcNumber }}
          formData={formData}
          schema={technical}
          slug="technical"
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
  TechnicalAssessment,
  getTechnicalAssessmentQuery,
  withRelayOptions
);
