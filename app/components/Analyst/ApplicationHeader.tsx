import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import AssignLead from 'components/Analyst/AssignLead';
import AssignPackage from 'components/Analyst/AssignPackage';
import ChangeStatus from 'components/Analyst/ChangeStatus';
import statusStyles from 'data/statusStyles';
import StatusPill from '../StatusPill';

const StyledCallout = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-left: 4px solid ${(props) => props.theme.color.links};
`;

const StyledH1 = styled.h1`
  font-size: 24px;
  margin: 8px 0;
`;
const StyledH2 = styled.h2`
  margin: 0;
  font-size: 16px;
`;

const StyledDiv = styled.div`
  display: grid;
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

const ApplicationHeader: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ApplicationHeader_query on Query {
        applicationByRowId(rowId: $rowId) {
          analystLead
          organizationName
          ccbcNumber
          projectName
          rowId
          externalStatus
          ...AssignPackage_query
        }
        ...AssignLead_query
        ...ChangeStatus_query
      }
    `,
    query
  );

  const { applicationByRowId } = queryFragment;
  const {
    analystLead,
    ccbcNumber,
    organizationName,
    projectName,
    rowId,
    externalStatus,
  } = applicationByRowId;
  return (
    <StyledCallout>
      <div>
        <StyledH2>{ccbcNumber}</StyledH2>
        <StyledH1>{projectName}</StyledH1>
        <StyledH2>{organizationName}</StyledH2>
      </div>
      <StyledDiv>
        <StyledItem style={{ marginBottom: '0.3rem' }}>
          <StyledLabel htmlFor="change-status">Internal Status</StyledLabel>
          <ChangeStatus query={queryFragment} />
        </StyledItem>
        <StyledItem>
          <StyledLabel id="status-pill">External Status</StyledLabel>
          <StatusPill status={externalStatus} styles={statusStyles} />
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
