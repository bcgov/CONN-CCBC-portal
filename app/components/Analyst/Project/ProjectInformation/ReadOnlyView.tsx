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
} from '@fortawesome/free-solid-svg-icons';

const StyledGrid = styled.div`
  ${(props) => props.theme.breakpoint.mediumUp} {
    display: grid;
    grid-template-columns: 20% 40% 15% 15% 8% 4%;
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

const StyledHideButton = styled.div`
  display: none;
  margin-left: 8px;

  ${(props) => props.theme.breakpoint.mediumUp} {
    display: block;
  }
`;

const StyledToggleSection = styled.div<ToggleProps>`
  display: flex;
  flex-direction: column;
  background: red;
  overflow: hidden;
  /*   max-height: ${({ isShowMore }) => (isShowMore ? '300px' : '0px')}; */
  transition: transform 0.3s;
  transform-origin: top left;
  transform: ${({ isShowMore }) => (isShowMore ? '' : 'scaleY(0)')};
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

const IconButton = ({ onClick }) => {
  return (
    <StyledIconBtn onClick={onClick} data-testid="project-form-edit-button">
      <FontAwesomeIcon icon={faPen} size="xs" />
    </StyledIconBtn>
  );
};

interface Props {
  dateSigned?: string;
  fundingAgreement?: any;
  map?: any;
  onFormEdit?: any;
  isChangeRequest?: boolean;
  isFormEditMode?: boolean;
  sow?: any;
  title: string;
  wirelessSow?: any;
}

const ReadOnlyView: React.FC<Props> = ({
  dateSigned,
  fundingAgreement,
  isChangeRequest,
  isFormEditMode,
  map,
  onFormEdit,
  sow,
  title,
  wirelessSow,
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
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
              View more <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </StyledArrowButton>
          )}
        </div>
        <div />
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
              <FileHeader icon={faFileExcel} title="SoW" />
            </DownloadLink>
          )}
        </StyledColumn>
        <StyledColumn>
          {map && (
            <DownloadLink uuid={map.uuid} fileName={map.name}>
              <FileHeader icon={faMap} title="Map" />
            </DownloadLink>
          )}
          {wirelessSow && (
            <DownloadLink uuid={wirelessSow.uuid} fileName={wirelessSow.name}>
              <FileHeader icon={faFileExcel} title="Wireless SoW" />
            </DownloadLink>
          )}
        </StyledColumn>
        <div>{dateSigned}</div>
        <StyledHideButton>
          {!isFormEditMode && <IconButton onClick={onFormEdit} />}
        </StyledHideButton>
      </StyledGrid>
      <StyledToggleSection isShowMore={showMore}>
        togglesection
        <StyledArrowButton
          type="button"
          onClick={() => setShowMore(!showMore)}
          isShowMore={showMore}
        >
          View more <FontAwesomeIcon icon={faChevronRight} size="xs" />
        </StyledArrowButton>
        <StyledArrowButton
          type="button"
          onClick={() => setShowMore(!showMore)}
          isShowMore={showMore}
        >
          View more <FontAwesomeIcon icon={faChevronRight} size="xs" />
        </StyledArrowButton>
      </StyledToggleSection>
    </div>
  );
};

export default ReadOnlyView;
