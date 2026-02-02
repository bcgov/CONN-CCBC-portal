import { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import LoadingSpinner from 'components/LoadingSpinner';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px;
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  &[aria-disabled='true'] {
    cursor: default;
  }
`;

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
};

const DownloadIcon = ({ handleClick, isLoading }) => {
  return (
    <StyledButton
      type="button"
      onClick={isLoading ? undefined : handleClick}
      aria-label="Download XLS file"
      aria-busy={isLoading}
      aria-disabled={isLoading}
      data-testid="download-dashboard-icon"
    >
      {isLoading ? (
        <LoadingSpinner color="#345FA9" />
      ) : (
        <StyledFontAwesome
          icon={faFileDownload}
          fixedWidth
          size="lg"
          color="#345FA9"
        />
      )}
      {isLoading ? (
        <span role="status" aria-live="polite" style={visuallyHidden}>
          Downloading XLS file
        </span>
      ) : null}
    </StyledButton>
  );
};

export default DownloadIcon;
