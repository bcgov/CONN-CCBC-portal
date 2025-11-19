import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';

const StyledValue = styled('div')`
  padding-bottom: 8px;
  min-width: 296px;
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-left: 16px;
  margin-top: 10px;
  & svg {
    margin: 0 8px;
  }
`;

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

const ReadOnlyFileWidget: React.FC<WidgetProps> = ({ value }) => {
  const isFile = value?.length > 0;

  return (
    <StyledValue>
      {isFile
        ? value.map((file) => (
            <StyledFileDiv key={file.uuid}>
              <StyledLink
                data-testid="file-download-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(file.uuid, file.name);
                }}
              >
                {file.name}
              </StyledLink>
            </StyledFileDiv>
          ))
        : 'No file'}
    </StyledValue>
  );
};

export default ReadOnlyFileWidget;
