import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import {
  AssessmentsTabs,
  AssessmentsForm,
} from 'components/Analyst/Assessments';
import projectManagement from 'formSchema/analyst/projectManagement';
import GuideLink from 'components/Analyst/GuideLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { projectManagementAssessmentQuery } from '__generated__/projectManagementAssessmentQuery.graphql';
import styled from 'styled-components';
import Link from 'next/link';
import { CCBC_PM_ESSENTIALS_TEMPLATE } from 'data/externalConstants';

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

const getPmAssessmentQuery = graphql`
  query projectManagementAssessmentQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      ...AssessmentsForm_query
      assessmentForm(_assessmentDataType: "projectManagement") {
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

const PmAssessment = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, projectManagementAssessmentQuery>) => {
  const query = usePreloadedQuery(getPmAssessmentQuery, preloadedQuery);

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
          <StyledLink href={CCBC_PM_ESSENTIALS_TEMPLATE}>
            <FontAwesomeIcon icon={faFileLines} /> CCBC_PM Essentials
            Template.xlsm
          </StyledLink>
        </StyledInfoBarDiv>
        <AssessmentsForm
          addedContext={{ ccbcNumber: applicationByRowId.ccbcNumber }}
          formData={applicationByRowId.assessmentForm?.jsonData}
          schema={projectManagement}
          slug="projectManagement"
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

export default withRelay(PmAssessment, getPmAssessmentQuery, withRelayOptions);
