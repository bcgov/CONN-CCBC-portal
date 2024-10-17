import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useRouter } from 'next/router';

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

  const { section: toggledSection } = useRouter().query;
  const projectInformationRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      projectInformation: projectInformationRef,
    }),
    []
  );

  useEffect(() => {
    const anchorRef = sectionRefs[toggledSection as string];
    if (toggledSection && anchorRef?.current) {
      const scrollTimeout = setTimeout(() => {
        window.scrollTo({
          top:
            anchorRef.current.getBoundingClientRect().top +
            window.scrollY -
            100,
          behavior: 'smooth',
        });
      }, 500);
      return () => clearTimeout(scrollTimeout);
    }
    return undefined;
  }, [sectionRefs, toggledSection]);

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
    if (
      isFundingAgreementSigned &&
      isConditionalApprovalComplete(conditionalApproval?.jsonData)
    ) {
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
  }, [conditionalApproval, date, projectInformation]);

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
          <div ref={projectInformationRef}>
            <ProjectInformationForm
              application={applicationByRowId}
              isExpanded={
                isProjectInformationExpanded ||
                toggledSection === 'projectInformation'
              }
            />
          </div>
        )}
        {showCommunityProgressReport && (
          <CommunityProgressReportForm
            application={applicationByRowId}
            isExpanded={isCommunityProgressExpanded}
          />
        )}
        {showMilestones && (
          <MilestonesForm
            application={applicationByRowId}
            isExpanded={isMilestonesExpanded}
          />
        )}
        {showClaims && (
          <ClaimsForm
            application={applicationByRowId}
            isExpanded={isClaimsExpanded}
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
