import { graphql, useFragment } from 'react-relay/hooks';
import styled from 'styled-components';
import DownloadLink from 'components/DownloadLink';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import { ViewDeleteButton, ViewEditButton } from '..';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
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
  milestone: any;
  isFormEditMode: boolean;
  onFormEdit: () => void;
  onShowDeleteModal: () => void;
}

const MilestonesView: React.FC<Props> = ({
  milestone,
  isFormEditMode,
  onFormEdit,
  onShowDeleteModal,
}) => {
  const queryFragment = useFragment(
    graphql`
      fragment MilestonesView_query on ApplicationMilestoneData {
        __id
        jsonData
      }
    `,
    milestone
  );

  const { jsonData } = queryFragment;

  const milestoneFile = jsonData?.milestoneFile?.[0];
  const dueDate = jsonData?.dueDate;

  return (
    <StyledContainer>
      <StyledDate>
        <span>{dueDate && getFiscalQuarter(dueDate)}</span>
        <span>{dueDate && getFiscalYear(dueDate)}</span>
      </StyledDate>
      <DownloadLink fileName="Milestone Report" uuid={milestoneFile?.uuid} />
      {!isFormEditMode && (
        <StyledFlex>
          <ViewEditButton onClick={onFormEdit} />
          <ViewDeleteButton onClick={onShowDeleteModal} />
        </StyledFlex>
      )}
    </StyledContainer>
  );
};

export default MilestonesView;
