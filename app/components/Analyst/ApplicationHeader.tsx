import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AssignLead from 'components/Analyst/AssignLead';
import AssignPackage from 'components/Analyst/AssignPackage';
import ChangeStatus from 'components/Analyst/ChangeStatus';
import { useFeature } from '@growthbook/growthbook-react';
import EditProjectDescription from './EditProjectDescription';
import StatusInformationIcon from './StatusInformationIcon';
import AssignProjectType from './AssignProjectType';
import PendingChangeRequest from './PendingChangeRequest/PendingChangeRequest';

const StyledCallout = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  padding-bottom: 0;
  border-left: 4px solid ${(props) => props.theme.color.links};
  width: 100%;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const StyledH1 = styled.h1`
  font-size: 24px;
  margin: 8px 0;
`;

const StyledH2 = styled.h2`
  margin: 0;
  font-size: 16px;
`;

const StyledProjectInfo = styled.div`
  width: 100%;
  @media (max-width: 1200px) {
    word-break: break-word;
    overflow-wrap: break-word;
    margin-left: 60px;
  }
  @media (max-width: 975px) {
    word-break: break-word;
    overflow-wrap: break-word;
    margin-left: 150px;
  }
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    word-break: break-word;
    overflow-wrap: break-word;
    width: 80vw;
    max-width: 200vw;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    left: 50%;
    right: 30%;
    transform: translateX(-50%);
    margin-left: 0;
  }
`;

const StyledDiv = styled.div`
  display: grid;
  height: fit-content;
  @media (max-width: 975px) {
    margin-right: 160px;
  }
  @media (max-width: 900px) {
    width: 80vw;
    left: 50%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledLabel = styled.label`
  min-width: 210px;
  color: ${(props) => props.theme.color.components};
  padding-right: 1rem;
  direction: rtl;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0 0 0;
`;

const StyledPackage = styled(StyledItem)`
  margin: 8px 0 0 0;
`;

const StyledProjectType = styled(StyledItem)`
  margin: 8px 0 0 0;
`;

const StyledPendingChangeRequests = styled(StyledItem)`
  margin: 8px 0;
`;

interface Props {
  query: any;
}

const disabledStatusList = {
  approved: ['withdrawn', 'analyst_withdrawn'],
  complete: ['withdrawn', 'analyst_withdrawn'],
  received: [
    'assessment',
    'recommendation',
    'conditionally_approved',
    'approved',
    'complete',
    'cancelled',
  ],
  screening: [
    'recommendation',
    'conditionally_approved',
    'approved',
    'complete',
    'cancelled',
  ],
  assessment: ['conditionally_approved', 'approved', 'complete', 'cancelled'],
  recommendation: ['approved', 'complete', 'cancelled'],
  conditionally_approved: ['complete', 'cancelled'],
};

const ApplicationHeader: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ApplicationHeader_query on Query {
        applicationByRowId(rowId: $rowId) {
          analystLead
          analystStatus
          organizationName
          ccbcNumber
          projectName
          intakeNumber
          rowId
          externalStatus
          ...ChangeStatus_query
          ...AssignPackage_query
          ...EditProjectDescription_query
          ...AssignProjectType_query
          ...PendingChangeRequest_query_application
        }
        ...AssignLead_query
        allApplicationStatusTypes(
          orderBy: STATUS_ORDER_ASC
          condition: { visibleByAnalyst: true }
        ) {
          nodes {
            name
            description
            id
          }
        }
      }
    `,
    query
  );

  const { allApplicationStatusTypes, applicationByRowId } = queryFragment;
  const {
    analystLead,
    analystStatus,
    ccbcNumber,
    externalStatus,
    organizationName,
    projectName,
    rowId,
    intakeNumber,
  } = applicationByRowId;

  const showLead = useFeature('show_lead').value;
  const isInternalIntake = intakeNumber === 99;

  if (isInternalIntake) {
    // you could use splice to remove the element in place, but if the component refreshses it'll remove more than intended
    // easier to just assign it the new value
    disabledStatusList.received = [
      'assessment',
      'conditionally_approved',
      'approved',
      'complete',
      'cancelled',
    ];
  }

  return (
    <StyledCallout>
      <StyledProjectInfo>
        <StyledH2>{ccbcNumber}</StyledH2>
        <StyledH1>{projectName}</StyledH1>
        <StyledH2>{organizationName}</StyledH2>
        <EditProjectDescription application={applicationByRowId} />
      </StyledProjectInfo>
      <StyledDiv>
        <StyledItem>
          <StyledLabel htmlFor="change-status">Internal Status</StyledLabel>
          <ChangeStatus
            application={applicationByRowId}
            disabledStatusList={disabledStatusList}
            hiddenStatusTypes={['draft', 'submitted', 'analyst_withdrawn']}
            status={
              analystStatus === 'analyst_withdrawn'
                ? 'withdrawn'
                : analystStatus
            }
            statusList={allApplicationStatusTypes?.nodes}
          />
          <StatusInformationIcon type="ccbc" />
        </StyledItem>
        <StyledItem>
          <StyledLabel htmlFor="change-status">External Status</StyledLabel>
          <ChangeStatus
            application={applicationByRowId}
            hiddenStatusTypes={[
              'analyst_withdrawn',
              'assessment',
              'draft',
              'recommendation',
              'screening',
              'submitted',
            ]}
            isExternalStatus
            status={externalStatus.replace('applicant_', '')}
            statusList={allApplicationStatusTypes.nodes}
          />
        </StyledItem>
        <StyledPackage>
          <StyledLabel htmlFor="assign-package">Package</StyledLabel>
          <AssignPackage application={applicationByRowId} />
        </StyledPackage>
        {showLead && (
          <StyledItem>
            <StyledLabel htmlFor="assign-lead">Lead</StyledLabel>
            <AssignLead
              label="Lead"
              applicationId={rowId}
              lead={analystLead}
              query={queryFragment}
            />
          </StyledItem>
        )}
        <StyledProjectType>
          <StyledLabel htmlFor="assign-project-type">Project Type</StyledLabel>
          <AssignProjectType application={applicationByRowId} />
        </StyledProjectType>

        <StyledPendingChangeRequests>
          <StyledLabel htmlFor="assign-project-type">
            Pending Change Request
          </StyledLabel>
          <PendingChangeRequest application={applicationByRowId} />
        </StyledPendingChangeRequests>
      </StyledDiv>
    </StyledCallout>
  );
};

export default ApplicationHeader;
