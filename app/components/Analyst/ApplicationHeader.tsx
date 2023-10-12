import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AssignLead from 'components/Analyst/AssignLead';
import AssignPackage from 'components/Analyst/AssignPackage';
import ChangeStatus from 'components/Analyst/ChangeStatus';
import EditProjectDescription from './EditProjectDescription';
import StatusInformationIcon from './StatusInformationIcon';

const StyledCallout = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  padding-bottom: 0;
  border-left: 4px solid ${(props) => props.theme.color.links};
  width: 100%;
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
`;

const StyledDiv = styled.div`
  display: grid;
  height: fit-content;
`;

const StyledLabel = styled.label`
  min-width: 130px;
  color: ${(props) => props.theme.color.components};
  padding-right: 1rem;
  direction: rtl;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
`;

const StyledPackage = styled(StyledItem)`
  margin: 8px 0;
`;

interface Props {
  query: any;
}

const disabledStatusList = {
  approved: ['analyst_withdrawn'],
  complete: ['analyst_withdrawn'],
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
          rowId
          externalStatus
          ...ChangeStatus_query
          ...AssignPackage_query
          ...EditProjectDescription_query
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
  } = applicationByRowId;

  return (
    <StyledCallout>
      <StyledProjectInfo>
        <StyledH2>{ccbcNumber}</StyledH2>
        <StyledH1>{projectName}</StyledH1>
        <StyledH2>{organizationName}</StyledH2>
        <EditProjectDescription application={applicationByRowId} />
      </StyledProjectInfo>
      <StyledDiv>
        <StyledItem style={{ marginBottom: '0.3rem' }}>
          <StyledLabel htmlFor="change-status">Internal Status</StyledLabel>
          <ChangeStatus
            application={applicationByRowId}
            disabledStatusList={disabledStatusList}
            hiddenStatusTypes={['draft', 'submitted', 'withdrawn']}
            status={analystStatus}
            statusList={allApplicationStatusTypes?.nodes}
          />
          <StatusInformationIcon />
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
        <StyledItem>
          <StyledLabel htmlFor="assign-lead">Lead</StyledLabel>
          <AssignLead
            label="Lead"
            applicationId={rowId}
            lead={analystLead}
            query={queryFragment}
          />
        </StyledItem>
      </StyledDiv>
    </StyledCallout>
  );
};

export default ApplicationHeader;
