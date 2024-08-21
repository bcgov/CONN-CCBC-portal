import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import CbcChangeStatus from './CbcChangeStatus';
import PendingChangeRequest from '../PendingChangeRequest/PendingChangeRequest';
import CbcEditProjectDescription from './CbcEditProjectDescription';
import CbcAssignProjectType from './CbcAssignProjectType';
import CbcEditProjectNumber from './CbcEditProjectNumber';

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

const StyledProjectType = styled(StyledItem)`
  margin: 8px 0 0 0;
`;

const StyledPendingChangeRequests = styled(StyledItem)`
  margin: 8px 0;
`;

interface Props {
  query: any;
  isFormEditable: boolean;
}

const CbcHeader: React.FC<Props> = ({ query, isFormEditable = false }) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcHeader_query on Query {
        cbcByRowId(rowId: $rowId) {
          projectNumber
          rowId
          sharepointTimestamp
          cbcDataByCbcId(first: 500)
            @connection(key: "CbcData__cbcDataByCbcId") {
            edges {
              node {
                jsonData
                sharepointTimestamp
                rowId
                projectNumber
                updatedAt
                updatedBy
              }
            }
          }
          ...CbcChangeStatus_query
          ...AssignField_query
          ...PendingChangeRequest_query_cbc
          ...CbcEditProjectDescription_query
          ...CbcAssignProjectType_query
          ...CbcEditProjectNumber_query
        }
        session {
          sub
          authRole
        }
      }
    `,
    query
  );

  const { cbcByRowId } = queryFragment;
  const { cbcDataByCbcId } = cbcByRowId;
  const { projectNumber } = cbcByRowId;
  const { edges } = cbcDataByCbcId;
  const cbcData = edges[0].node;
  const { jsonData } = cbcData;
  const status = jsonData.projectStatus;

  return (
    <StyledCallout>
      <StyledProjectInfo>
        {/* <StyledH2>{projectNumber}</StyledH2> */}
        <CbcEditProjectNumber
          cbc={cbcByRowId}
          value={projectNumber}
          isHeaderEditable={isFormEditable}
        />
        <StyledH1>{jsonData.projectTitle}</StyledH1>
        <StyledH2>{jsonData.currentOperatingName}</StyledH2>
        <CbcEditProjectDescription
          cbc={cbcByRowId}
          isHeaderEditable={isFormEditable}
        />
      </StyledProjectInfo>
      <StyledDiv>
        <StyledItem>
          <StyledLabel htmlFor="change-status">External Status</StyledLabel>
          <CbcChangeStatus
            cbc={cbcByRowId}
            status={status}
            statusList={[
              {
                description: 'Conditionally Approved',
                name: 'conditionally_approved',
                id: 1,
              },
              { description: 'Agreement Signed', name: 'approved', id: 3 },
              { description: 'Reporting Complete', name: 'complete', id: 2 },
              { description: 'Withdrawn', name: 'withdrawn', id: 4 },
            ]}
            isFormEditable={isFormEditable}
          />
        </StyledItem>
        <StyledProjectType>
          <StyledLabel htmlFor="assign-project-type">Project Type</StyledLabel>
          <CbcAssignProjectType
            cbc={cbcByRowId}
            isHeaderEditable={isFormEditable}
          />
        </StyledProjectType>
        <StyledPendingChangeRequests>
          <StyledLabel htmlFor="assign-project-type">
            Pending Change Request
          </StyledLabel>
          <PendingChangeRequest
            application={cbcByRowId}
            isCbc
            isFormEditable={isFormEditable}
          />
        </StyledPendingChangeRequests>
      </StyledDiv>
    </StyledCallout>
  );
};

export default CbcHeader;
