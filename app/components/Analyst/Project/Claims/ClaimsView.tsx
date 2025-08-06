import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import DownloadLink from 'components/DownloadLink';
import { ViewDeleteButton, ViewEditButton } from '..';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 48px 164px 4fr 1fr;
  margin-bottom: 8px;
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: flex-end;

  & button:first-child {
    margin-right: 16px;
  }
`;

const StyledDate = styled.div`
  white-space: nowrap;
  font-weight: 700;
  margin-right: 16px;

  ${(props) => props.theme.breakpoint.mediumUp} {
    margin: 0;
  }
`;

const StyledSuperScript = styled.span`
  vertical-align: super;
  font-size: 10px;
`;

interface Props {
  claim: any;
  isFormEditMode: boolean;
  onFormEdit: () => void;
  onShowDeleteModal: () => void;
}

const ClaimsView: React.FC<Props> = ({
  claim,
  isFormEditMode,
  onFormEdit,
  onShowDeleteModal,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment ClaimsView_query on ApplicationClaimsData {
        __id
        jsonData
        applicationByApplicationId {
          applicationClaimsExcelDataByApplicationId {
            nodes {
              rowId
              jsonData
            }
          }
        }
      }
    `,
    claim
  );
  const excelData =
    queryFragment?.applicationByApplicationId?.applicationClaimsExcelDataByApplicationId?.nodes.filter(
      (node) => {
        return node.rowId === claim.excelDataId;
      }
    )[0];

  const { jsonData } = queryFragment;
  const excelJsonData = excelData?.jsonData;

  const claimsFile = jsonData?.claimsFile?.[0];

  const fromDate =
    excelJsonData?.eligibleCostsIncurredFromDate &&
    DateTime.fromJSDate(
      new Date(excelJsonData.eligibleCostsIncurredFromDate)
    ).setZone('UTC');

  const toDate =
    excelJsonData?.eligibleCostsIncurredToDate &&
    DateTime.fromJSDate(
      new Date(excelJsonData.eligibleCostsIncurredToDate)
    ).setZone('UTC');
  const formattedDate =
    fromDate &&
    toDate &&
    `${fromDate?.monthShort} ${fromDate?.year} - ${toDate?.monthShort} ${toDate?.year}`;

  return (
    <StyledContainer>
      <div>
        <StyledSuperScript>#</StyledSuperScript>
        <b>{excelJsonData?.claimNumber}</b>
      </div>
      <StyledDate>{formattedDate}</StyledDate>
      <DownloadLink fileName={claimsFile?.name} uuid={claimsFile?.uuid} />
      {!isFormEditMode && (
        <StyledFlex>
          <ViewEditButton onClick={onFormEdit} />
          <ViewDeleteButton onClick={onShowDeleteModal} />
        </StyledFlex>
      )}
    </StyledContainer>
  );
};

export default ClaimsView;
