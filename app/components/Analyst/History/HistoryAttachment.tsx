import styled from 'styled-components';
import * as Sentry from '@sentry/nextjs';

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
`;

const handleDownload = async (uuid, fileName) => {
  const encodedFileName = encodeURIComponent(fileName);
  const url = `/api/s3/download/${uuid}/${encodedFileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      window.open(response, '_blank');
    });
};

const HistoryAttachment = ({ displayName, record, createdAtFormatted }) => {
  return (
    <span>
      {`${displayName} uploaded `}
      <StyledLink
        data-testid="history-attachment-link"
        onClick={(e) => {
          e.preventDefault();
          handleDownload(record.file, record.file_name).catch((error) => {
            Sentry.captureException(error);
          });
        }}
      >
        {`${record.file_name}`}
      </StyledLink>
      {` on ${createdAtFormatted}`}
    </span>
  );
};

export default HistoryAttachment;
