import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import LoadingSpinner from 'components/LoadingSpinner';

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin-left: 4px;
`;

const DownloadIcon = ({ handleClick, isLoading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner color="#345FA9" />
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={!isLoading ? handleClick : null}
          onKeyDown={!isLoading ? handleKeyDown : null}
          aria-labelledby="Download Excel of current projects"
          style={{ cursor: 'pointer' }}
          data-testid="download-dashboard-icon"
        >
          <StyledFontAwesome
            icon={faFileDownload}
            fixedWidth
            size="lg"
            color="#345FA9"
          />
        </div>
      )}
    </>
  );
};

export default DownloadIcon;
