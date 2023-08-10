import { ConnectionHandler, graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPen } from '@fortawesome/free-solid-svg-icons';
import DownloadLink from 'components/DownloadLink';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import { useArchiveApplicationCommunityProgressReportMutation as useArchiveCpr } from 'schema/mutations/project/archiveApplicationCommunityProgressReport';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
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
  connectionId: string;
  isFormEditMode: boolean;
  onFormEdit: () => void;
}

const CommunityProgressView: React.FC<Props> = ({
  communityProgressReport,
  connectionId,
  isFormEditMode,
  onFormEdit,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment CommunityProgressView_query on ApplicationCommunityProgressReportData {
        __id
        rowId
        jsonData
      }
    `,
    communityProgressReport
  );

  const { jsonData, rowId } = queryFragment;

  const [archiveCommunityProgressReport] = useArchiveCpr();

  const progressReportFile = jsonData?.progressReportFile?.[0];
  const dueDate = jsonData?.dueDate;

  const handleDelete = async () => {
    archiveCommunityProgressReport({
      variables: {
        input: {
          _communityProgressReportId: rowId,
        },
      },
      updater: (store) => {
        const connection = store.get(connectionId);
        const progressReportConnectionId = queryFragment.__id;

        store.delete(progressReportConnectionId);
        ConnectionHandler.deleteNode(connection, progressReportConnectionId);
      },
    });
  };

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
      {!isFormEditMode && (
        <StyledFlex>
          <StyledButton onClick={onFormEdit}>
            Edit <FontAwesomeIcon icon={faPen} />
          </StyledButton>
          <StyledDeleteButton onClick={handleDelete}>
            Delete <FontAwesomeIcon size="xl" icon={faClose} />
          </StyledDeleteButton>
        </StyledFlex>
      )}
    </StyledContainer>
  );
};

export default CommunityProgressView;
