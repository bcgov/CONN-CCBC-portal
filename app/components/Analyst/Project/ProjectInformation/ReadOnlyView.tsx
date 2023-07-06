import styled from 'styled-components';
import { DateTime } from 'luxon';
import FileHeader from 'components/Analyst/Project/ProjectInformation/FileHeader';
import DownloadLink from 'components/DownloadLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
`;

const StyledH3 = styled.h3`
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
  isFormEditMode?: boolean;
  sow?: any;
  title: string;
  wirelessSow?: any;
}

const ReadOnlyView: React.FC<Props> = ({
  dateSigned,
  fundingAgreement,
  isFormEditMode,
  map,
  onFormEdit,
  sow,
  title,
  wirelessSow,
}) => {
  const formattedDateSigned = DateTime.fromISO(dateSigned).toLocaleString(
    DateTime.DATE_MED
  );

  return (
    <StyledGrid>
      <StyledH3>
        {title}
        {!isFormEditMode && <IconButton onClick={onFormEdit} />}
      </StyledH3>
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
      <div>{formattedDateSigned}</div>
      <StyledHideButton>
        {!isFormEditMode && <IconButton onClick={onFormEdit} />}
      </StyledHideButton>
    </StyledGrid>
  );
};

export default ReadOnlyView;
