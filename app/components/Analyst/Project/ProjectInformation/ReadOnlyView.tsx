import styled from 'styled-components';
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
  display: grid;
  grid-template-columns: 20% 40% 15% 15% 8% 4%;
`;

const StyledColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const StyledIconBtn = styled.button`
  border-radius: 0;
  appearance: none;
  height: fit-content;

  & svg {
    color: ${(props) => props.theme.color.links};
  }

  &:hover {
    opacity: 0.7;
  }
`;

interface Props {
  dateSigned?: string;
  fundingAgreement?: any;
  map?: any;
  setIsFormEditMode?: any;
  sow?: any;
  title: string;
  wirelessSow?: any;
}

const ReadOnlyView: React.FC<Props> = ({
  dateSigned,
  fundingAgreement,
  map,
  setIsFormEditMode,
  sow,
  title,
  wirelessSow,
}) => {
  return (
    <StyledGrid>
      <h3>{title}</h3>
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
      <StyledIconBtn onClick={() => setIsFormEditMode(true)}>
        <FontAwesomeIcon icon={faPen} size="xs" />
      </StyledIconBtn>
    </StyledGrid>
  );
};

export default ReadOnlyView;
