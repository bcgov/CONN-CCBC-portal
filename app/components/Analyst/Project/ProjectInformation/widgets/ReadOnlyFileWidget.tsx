import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledContainer = styled('div')`
  padding: 8px 12px;
  background: #f8f8f8;
  border-radius: 8px;
  min-height: 64px;
  min-width: 340px;
  margin-bottom: 8px;

  & button {
    margin-top: 8px;
  }
`;

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
`;

const handleDownload = async (uuid, fileName) => {
  const url = `/api/s3/download/${uuid}/${fileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      window.open(response, '_blank');
    });
};

const ReadOnlyFileWidget: React.FC<WidgetProps> = ({ uiSchema, value }) => {
  const isFile = value?.length > 0;
  const file = isFile && value[0];
  const before = uiSchema?.['ui:before'];

  return (
    <StyledContainer>
      {before}
      {isFile && (
        <StyledLink
          data-testid="file-download-link"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(file.uuid, file.name);
          }}
        >
          {file.name}
        </StyledLink>
      )}
    </StyledContainer>
  );
};

export default ReadOnlyFileWidget;
