import { useEffect, useState } from 'react';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import cookie from 'js-cookie';
import { DateTime } from 'luxon';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { projectQuery } from '__generated__/projectQuery.graphql';
import { useFeature } from '@growthbook/growthbook-react';
import ConditionalApprovalForm from 'components/Analyst/Project/ConditionalApproval/ConditionalApprovalForm';
import AnnouncementsForm from 'components/Analyst/Project/Announcements/AnnouncementsForm';
import ProjectInformationForm from 'components/Analyst/Project/ProjectInformation/ProjectInformationForm';
import CommunityProgressReportForm from 'components/Analyst/Project/CommunityProgressReport/CommunityProgressReportForm';
import ClaimsForm from 'components/Analyst/Project/Claims/ClaimsForm';
import MilestonesForm from 'components/Analyst/Project/Milestones/MilestonesForm';
import {
  isClaimsOpen,
  isCommunityProgressOpen,
  isMilestonesOpen,
  isConditionalApprovalComplete,
} from 'utils/projectAccordionValidators';

const getProjectQuery = graphql`
  query projectQuery($rowId: Int!) {
    session {
      sub
    }
    applicationByRowId(rowId: $rowId) {
      conditionalApproval {
        jsonData
      }
      projectInformation {
        jsonData
      }

      ...CommunityProgressReportForm_application
      ...ConditionalApprovalForm_application
      ...ProjectInformationForm_application
      ...CommunityProgressReportForm_application
      ...ClaimsForm_application
      ...MilestonesForm_application
    }
    ...AnalystLayout_query
    ...AnnouncementsForm_query
  }
`;

const Project = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, projectQuery>) => {
  const query = usePreloadedQuery(getProjectQuery, preloadedQuery);
  const { applicationByRowId, session } = query;
  const { conditionalApproval, projectInformation } = applicationByRowId || {};

  const showConditionalApproval = useFeature('show_conditional_approval').value;
  const showAnnouncement = useFeature('show_announcement').value;
  const showProjectInformation = useFeature('show_project_information').value;
  const showCommunityProgressReport = useFeature(
    'show_community_progress_report'
  ).value;
  const showClaims = useFeature('show_claims').value;
  const showMilestones = useFeature('show_milestones').value;

  const today = DateTime.now().toFormat('yyyy-MM-dd');
  const date = cookie.get('mocks.mocked_date') || today;

  const [isConditionalApprovalExpanded, setIsConditionalApprovalExpanded] =
    useState(false);
  const [isProjectInformationExpanded, setIsProjectInformationExpanded] =
    useState(false);

  const [isClaimsExpanded, setIsClaimsExpanded] = useState(false);
  const [isMilestonesExpanded, setIsMilestonesExpanded] = useState(false);
  const [isCommunityProgressExpanded, setIsCommunityProgressExpanded] =
    useState(false);

  useEffect(() => {
    const isFundingAgreementSigned =
      projectInformation?.jsonData?.hasFundingAgreementBeenSigned;

    if (isConditionalApprovalComplete(conditionalApproval?.jsonData)) {
      setIsConditionalApprovalExpanded(false);
      setIsProjectInformationExpanded(true);
    } else {
      setIsConditionalApprovalExpanded(true);
      setIsProjectInformationExpanded(false);
    }
    if (isFundingAgreementSigned) {
      setIsConditionalApprovalExpanded(false);
      setIsProjectInformationExpanded(false);

      if (isClaimsOpen(date)) {
        setIsClaimsExpanded(true);
      }

      if (isMilestonesOpen(date)) {
        setIsMilestonesExpanded(true);
      }

      if (isCommunityProgressOpen(date)) {
        setIsCommunityProgressExpanded(true);
      }
    }
  }, [conditionalApproval, projectInformation]);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        {showConditionalApproval && (
          <ConditionalApprovalForm
            application={applicationByRowId}
            isExpanded={isConditionalApprovalExpanded}
          />
        )}
        {showAnnouncement && <AnnouncementsForm query={query} />}
        {showProjectInformation && (
          <ProjectInformationForm
            application={applicationByRowId}
            isExpanded={isProjectInformationExpanded}
          />
        )}
        {showCommunityProgressReport && (
          <CommunityProgressReportForm
            application={applicationByRowId}
            isExpanded={isCommunityProgressExpanded}
          />
        )}
        {showClaims && (
          <ClaimsForm
            application={applicationByRowId}
            isExpanded={isClaimsExpanded}
          />
        )}
        {showMilestones && (
          <MilestonesForm
            application={applicationByRowId}
            isExpanded={isMilestonesExpanded}
          />
        )}
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

export default withRelay(Project, getProjectQuery, withRelayOptions);
