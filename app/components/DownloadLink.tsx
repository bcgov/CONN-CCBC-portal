import styled from 'styled-components';
import * as Sentry from '@sentry/nextjs';

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
  width: fit-content;
  :hover {
    cursor: pointer;
  }
`;

const handleDownload = async (uuid, fileName) => {
  const url = `/api/s3/download/${uuid}/${fileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      window.open(response, '_blank');
    });
};

const DownloadLink = ({ uuid, fileName }) => {
  return (
    <StyledLink
      data-testid="history-attachment-link"
      onClick={(e) => {
        e.preventDefault();
        handleDownload(uuid, fileName).catch((error) => {
          Sentry.captureException(error);
        });
      }}
    >
      {`${fileName}`}
    </StyledLink>
  );
};

export default DownloadLink;
