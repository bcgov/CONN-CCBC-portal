import { graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPen } from '@fortawesome/free-solid-svg-icons';
import DownloadLink from 'components/DownloadLink';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 128px 4fr 1fr;
  margin-bottom: 8px;
`;

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.color.links};
  font-size: 14px;
  font-weight: 700;

  & svg {
    margin-left: 4px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledDeleteButton = styled(StyledButton)`
  margin-left: 16px;
  color: ${(props) => props.theme.color.error}; |
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledDate = styled.div`
  white-space: nowrap;
  font-weight: 700;
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
      }
    `,
    claim
  );

  const { jsonData } = queryFragment;

  const claimsFile = jsonData?.claimsFile?.[0];

  const fromDate =
    jsonData?.fromDate &&
    DateTime.fromJSDate(new Date(jsonData.fromDate)).setZone('UTC');

  const toDate =
    jsonData?.toDate &&
    DateTime.fromJSDate(new Date(jsonData.toDate)).setZone('UTC');
  const formattedDate =
    fromDate &&
    toDate &&
    `${fromDate?.monthShort}-${toDate?.monthShort} ${toDate?.year}`;

  return (
    <StyledContainer>
      <StyledDate>{formattedDate}</StyledDate>
      <DownloadLink fileName={claimsFile?.name} uuid={claimsFile?.uuid} />
      {!isFormEditMode && (
        <StyledFlex>
          <StyledButton onClick={onFormEdit}>
            Edit <FontAwesomeIcon icon={faPen} />
          </StyledButton>
          <StyledDeleteButton onClick={onShowDeleteModal}>
            Delete <FontAwesomeIcon size="xl" icon={faClose} />
          </StyledDeleteButton>
        </StyledFlex>
      )}
    </StyledContainer>
  );
};

export default ClaimsView;
