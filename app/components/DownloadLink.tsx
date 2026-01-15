import styled from 'styled-components';
import { useState } from 'react';
import reportClientError from 'lib/helpers/reportClientError';

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
  // handle special characters
  const cleanFileName = fileName.replace(/,$/, '');
  const encodedFileName = encodeURIComponent(cleanFileName);
  const url = `/api/s3/download/${uuid}/${encodedFileName}`;
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

interface Props {
  children?: any;
  uuid: string;
  fileName: string;
  fileLabel?: string;
}

const DownloadLink: React.FC<Props> = ({
  children,
  uuid,
  fileName,
  fileLabel,
}) => {
  const [quarantinedLink, setQuarantinedLink] = useState(false);
  return quarantinedLink ? (
    <>`${fileLabel || fileName}`</>
  ) : (
    <StyledLink
      title={fileLabel || fileName}
      data-testid="history-attachment-link"
      onClick={(e) => {
        e.preventDefault();
        handleDownload(uuid, fileName, setQuarantinedLink).catch((error) => {
          reportClientError(error, { source: 'download-link' });
        });
      }}
    >
      {children || fileLabel || fileName}
    </StyledLink>
  );
};

export default DownloadLink;
