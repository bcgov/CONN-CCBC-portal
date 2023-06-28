import styled from 'styled-components';
import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
  width: fit-content;
  :hover {
    cursor: pointer;
  }
`;

const handleDownload = async (uuid, fileName, setQuarantinedLink) => {
  const url = `/api/s3/download/${uuid}/${fileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      if (typeof response === 'object' && response.avstatus === 'dirty') {
        setQuarantinedLink(true);
        // eslint-disable-next-line no-alert
        window.alert(
          'An error occurred when downloading the file. Contact the CCBC Portal administrator'
        );
      } else {
        window.open(response, '_blank');
      }
    });
};

const DownloadLink = ({ uuid, fileName }) => {
  const [quarantinedLink, setQuarantinedLink] = useState(false);
  return quarantinedLink ? (
    `${fileName}`
  ) : (
    <StyledLink
      data-testid="history-attachment-link"
      onClick={(e) => {
        e.preventDefault();
        handleDownload(uuid, fileName, setQuarantinedLink).catch((error) => {
          Sentry.captureException(error);
        });
      }}
    >
      {`${fileName}`}
    </StyledLink>
  );
};

export default DownloadLink;
