import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import CbcChangeStatus from './CbcChangeStatus';
import PendingChangeRequest from '../PendingChangeRequest/PendingChangeRequest';
import CbcEditProjectDescription from './CbcEditProjectDescription';
import CbcAssignProjectType from './CbcAssignProjectType';
import CbcEditProjectNumber from './CbcEditProjectNumber';
import StatusInformationIcon from '../StatusInformationIcon';
import CompactHeader from '../CompactHeader';

const StyledCallout = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  padding-bottom: 0;
  border-left: 4px solid ${(props) => props.theme.color.links};
  width: 100%;
  min-height: 191px;
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
  min-height: 152px;
  @media (max-width: 975px) {
    margin-right: 160px;
  }
  @media (max-width: 900px) {
    width: 80vw;
    left: 50%;
    margin-left: auto;
    margin-right: auto;
    min-height: unset;
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
    <>
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
            <StatusInformationIcon type="cbc" />
          </StyledItem>
          <StyledProjectType>
            <StyledLabel htmlFor="assign-project-type">
              Project Type
            </StyledLabel>
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
      {/* visible and sticky to the top whe scrolling */}
      <CompactHeader record={cbcByRowId} />
    </>
  );
};

export default CbcHeader;
