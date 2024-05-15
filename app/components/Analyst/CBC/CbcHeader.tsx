import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import CbcChangeStatus from './CbcChangeStatus';
import AssignField from './AssignField';

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
  margin: 8px 0 0 0;
`;

const StyledAssign = styled(StyledItem)`
  margin: 8px 0 0 0;
`;

interface Props {
  query: any;
}

const CbcHeader: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment CbcHeader_query on Query {
        cbcByRowId(rowId: $rowId) {
          projectNumber
          rowId
          sharepointTimestamp
          cbcDataByCbcId {
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
        }
      }
    `,
    query
  );

  const { cbcByRowId } = queryFragment;
  const { projectNumber, cbcDataByCbcId } = cbcByRowId;

  const { edges } = cbcDataByCbcId;
  const cbcData = edges[0].node;
  const { jsonData } = cbcData;
  const status = jsonData.projectStatus;

  return (
    <StyledCallout>
      <StyledProjectInfo>
        <StyledH2>{projectNumber}</StyledH2>
        <StyledH1>{jsonData.projectTitle}</StyledH1>
        <StyledH2>{jsonData.applicantContractualName}</StyledH2>
      </StyledProjectInfo>
      <StyledDiv>
        <StyledItem>
          <StyledLabel htmlFor="change-status">Status</StyledLabel>
          <CbcChangeStatus
            cbc={cbcByRowId}
            status={status}
            statusList={[
              {
                description: 'Conditionally Approved',
                name: 'conditionally_approved',
                id: 1,
              },
              { description: 'Reporting Complete', name: 'complete', id: 2 },
              { description: 'Agreement Signed', name: 'approved', id: 3 },
            ]}
          />
        </StyledItem>
        <StyledAssign>
          <StyledLabel htmlFor="assign-phase">Phase</StyledLabel>
          <AssignField
            // fieldValue={jsonData?.phase.toString() || null}
            fieldName="phase"
            fieldOptions={['1', '2', '3', '4', '4b']}
            fieldType="string"
            cbc={cbcByRowId}
          />
        </StyledAssign>
        <StyledAssign>
          <StyledLabel htmlFor="assign-intake">Intake</StyledLabel>
          <AssignField
            // fieldValue={jsonData?.intake || null}
            fieldName="intake"
            fieldOptions={[null, 1, 2, 3, 4]}
            fieldType="number"
            cbc={cbcByRowId}
          />
        </StyledAssign>
      </StyledDiv>
    </StyledCallout>
  );
};

export default CbcHeader;
