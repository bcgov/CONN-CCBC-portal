import { graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import DownloadLink from 'components/DownloadLink';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  margin-bottom: 8px;
`;

const StyledEditButton = styled.button`
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

const StyledDate = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-weight: 700;
  white-space: nowrap;
  margin-right: 16px;

  & span:first-child {
    min-width: 100px;
    margin-right: 8px;
  }

  & span:last-child {
    text-align: right;
  }
`;

interface Props {
  communityProgressReport: any;
  isFormEditMode: boolean;
  onFormEdit: () => void;
}

const CommunityProgressView: React.FC<Props> = ({
  communityProgressReport,
  isFormEditMode,
  onFormEdit,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CommunityProgressView_query on ApplicationCommunityProgressReportData {
        jsonData
      }
    `,
    communityProgressReport
  );

  const { jsonData } = queryFragment;

  const progressReportFile = jsonData?.progressReportFile?.[0];
  const dueDate = jsonData?.dueDate;

  return (
    <StyledContainer>
      <StyledDate>
        <span>{dueDate && getFiscalQuarter(dueDate)}</span>
        <span>{dueDate && getFiscalYear(dueDate)}</span>
      </StyledDate>
      <DownloadLink
        fileName={progressReportFile?.name}
        uuid={progressReportFile?.uuid}
      />
      <span>
        {!isFormEditMode && (
          <StyledEditButton onClick={onFormEdit}>
            Edit <FontAwesomeIcon icon={faPen} />
          </StyledEditButton>
        )}
      </span>
    </StyledContainer>
  );
};

export default CommunityProgressView;
