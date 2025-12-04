import { useState } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import FileHeader from 'components/Analyst/Project/ProjectInformation/FileHeader';
import DownloadLink from 'components/DownloadLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faFileContract,
  faFileExcel,
  faMap,
  faPen,
  faFileAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import ImportErrorMessage from './ImportErrorMessage';

const StyledGrid = styled.div`
  ${(props) => props.theme.breakpoint.mediumUp} {
    display: grid;
    grid-template-columns: 15% 39% 12% 12% 12% 8% 4%;
  }

  margin-bottom: 16px;
`;

const StyledH3 = styled.h3`
  margin-bottom: 4px;
  button {
    margin-left: 8px;
  }

  ${(props) => props.theme.breakpoint.mediumUp} {
    button {
      display: none;
    }
  }
`;

const StyledColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;

  & a {
    display: flex;
  }
`;

const StyledIconBtn = styled.button`
  border-radius: 0;
  appearance: none;
  height: fit-content;

  & svg {
    color: ${(props) => props.theme.color.links};
    padding-right: 8px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledDeleteBtn = styled.button`
  border-radius: 0;
  appearance: none;
  height: fit-content;

  & svg {
    color: ${(props) => props.theme.color.error};
    padding-right: 8px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StyledHideButton = styled.div`
  display: none;
  margin-left: 8px;

  ${(props) => props.theme.breakpoint.mediumUp} {
    display: block;
  }
`;

const StyledToggleSection = styled.div<ToggleProps>`
  display: grid;
  grid-template-columns: 18% 42% 40%;
  overflow: hidden;
  max-height: ${({ isShowMore }) => (isShowMore ? '600px' : '0px')};
  transition: all 0.5s;
  margin-bottom: 16px;

  h4 {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #757575;
  }

  span {
    min-height: 20px;
  }

  div:not(:last-child) {
    margin-right: 8px;
  }
`;

const StyledDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100%);
  height: 60px;
  padding-right: 8px;
`;

interface ToggleProps {
  isShowMore: boolean;
}

const StyledArrowButton = styled.button<ToggleProps>`
  color: ${(props) => props.theme.color.links};
  font-weight: 700;

  & svg {
    transform: ${({ isShowMore }) =>
      isShowMore ? 'rotate(90deg)' : 'rotate(0deg)'};
    transition: transform 0.3s;
  }
`;

const StyledContent = styled.div`
  margin-bottom: 16px;
`;

const IconButton = ({ onClick }) => {
  return (
    <StyledIconBtn onClick={onClick} data-testid="project-form-edit-button">
      <FontAwesomeIcon icon={faPen} size="xs" />
    </StyledIconBtn>
  );
};

const DeleteButton = ({ onClick }) => {
  return (
    <StyledDeleteBtn onClick={onClick} data-testid="project-form-delete-button">
      <FontAwesomeIcon icon={faTrash} size="xs" />
    </StyledDeleteBtn>
  );
};

interface Props {
  additionalComments?: string;
  changeRequestForm?: any;
  date?: string;
  dateRequested?: string;
  descriptionOfChanges?: string;
  fundingAgreement?: any;
  levelOfAmendment?: string;
  maps?: Array<any>;
  onFormEdit?: any;
  isChangeRequest?: boolean;
  isFormEditMode?: boolean;
  isSowUploadError?: boolean;
  sow?: any;
  title: string;
  wirelessSow?: any;
  sowTitle?: string;
  otherFiles?: Array<any>;
  setDeleteModalOpen?: (open: boolean) => void;
  setDeleteModalData?: (data: any) => void;
  amendmentNumber?: number | string;
}

const ReadOnlyView: React.FC<Props> = ({
  additionalComments,
  changeRequestForm,
  date,
  dateRequested,
  descriptionOfChanges,
  fundingAgreement,
  isChangeRequest,
  isFormEditMode,
  isSowUploadError,
  levelOfAmendment,
  maps,
  onFormEdit,
  sow,
  title,
  wirelessSow,
  sowTitle,
  otherFiles,
  amendmentNumber,
  setDeleteModalOpen,
  setDeleteModalData,
}) => {
  const [showMore, setShowMore] = useState(false);

  const formattedDate =
    date && DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);

  const formattedDateRequested =
    dateRequested &&
    DateTime.fromISO(dateRequested).toLocaleString(DateTime.DATE_MED);

  return (
    <>
      {isSowUploadError && !isFormEditMode && (
        <ImportErrorMessage
          title="Statement of Work data did not import"
          errorMessage="Press the edit pencil to try re-uploading"
        />
      )}
      <StyledGrid>
        <div>
          <StyledH3>
            {title}
            {!isFormEditMode && <IconButton onClick={onFormEdit} />}
          </StyledH3>
          {isChangeRequest && (
            <StyledArrowButton
              type="button"
              onClick={() => setShowMore(!showMore)}
              isShowMore={showMore}
            >
              {showMore ? 'View Less' : 'View more'}{' '}
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </StyledArrowButton>
          )}
        </div>
        <StyledDescription title={descriptionOfChanges}>
          {descriptionOfChanges}
        </StyledDescription>
        <StyledColumn>
          {fundingAgreement && (
            <DownloadLink
              uuid={fundingAgreement.uuid}
              fileName={fundingAgreement.name}
            >
              <FileHeader icon={faFileContract} title="Funding Agreement" />
            </DownloadLink>
          )}
          {sow && (
            <DownloadLink uuid={sow.uuid} fileName={sow.name}>
              <FileHeader icon={faFileExcel} title={sowTitle} />
            </DownloadLink>
          )}
        </StyledColumn>
        <StyledColumn>
          {maps?.map((mapItem) => (
            <DownloadLink
              key={mapItem.uuid}
              uuid={mapItem.uuid}
              fileName={mapItem.name}
            >
              <FileHeader icon={faMap} title={mapItem.name} />
            </DownloadLink>
          ))}
          {wirelessSow && (
            <DownloadLink uuid={wirelessSow.uuid} fileName={wirelessSow.name}>
              <FileHeader icon={faFileExcel} title="Wireless SoW" />
            </DownloadLink>
          )}
        </StyledColumn>
        <StyledColumn>
          {otherFiles?.map((otherFile) => (
            <DownloadLink
              key={otherFile.uuid}
              uuid={otherFile.uuid}
              fileName={otherFile.name}
            >
              <FileHeader icon={faFileAlt} title={otherFile.name} />
            </DownloadLink>
          ))}
        </StyledColumn>
        <div>{formattedDate}</div>
        <StyledHideButton>
          {!isFormEditMode && (
            <>
              <IconButton onClick={onFormEdit} />
              {isChangeRequest && (
                <DeleteButton
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setDeleteModalData({
                      amendmentNumber,
                      additionalComments,
                      changeRequestForm,
                      dateRequested,
                      descriptionOfChanges,
                      fundingAgreement,
                      levelOfAmendment,
                      maps,
                      sow,
                      title,
                      wirelessSow,
                      otherFiles,
                      date,
                      isChangeRequest,
                    });
                  }}
                />
              )}
            </>
          )}
        </StyledHideButton>
      </StyledGrid>
      <StyledToggleSection isShowMore={showMore}>
        <div>
          <div>
            <h4>Requested/Initiated</h4>
            <StyledContent>{formattedDateRequested || '‎'}</StyledContent>
          </div>
          <div>
            <h4>Level of amendment</h4>
            <StyledContent>{levelOfAmendment || '‎'}</StyledContent>
          </div>
        </div>
        <div>
          <h4>Change request form</h4>
          {changeRequestForm && (
            <DownloadLink
              uuid={changeRequestForm.uuid}
              fileName={changeRequestForm.name}
            />
          )}
        </div>
        <div>
          <h4>Additional Comments if necessary to justify amendment impact</h4>
          <span>{additionalComments}</span>
        </div>
      </StyledToggleSection>
    </>
  );
};

export default ReadOnlyView;
