import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin-bottom: 24px;
`;
const StyledH4 = styled.h4`
  margin-bottom: 8px;
`;

const StyledP = styled.p`
  color: ${(props) => props.theme.color.descriptionGrey};
`;

const StyledFileDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  padding-left: 8px;
`;

type File = {
  id: string | number;
  uuid: string;
  name: string;
  size: number;
  type: string;
};

const ListFilesWidget: React.FC<WidgetProps> = ({ label, value }) => {
  const isFiles = value?.length > 0;

  const handleDownload = async (uuid: string, fileName: string) => {
    const url = `/api/s3/download/${uuid}/${fileName}`;
    await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        window.open(response, '_blank');
      });
  };

  return (
    <StyledContainer>
      <StyledH4>{label}</StyledH4>

      {isFiles ? (
        value.map((file: File) => (
          <StyledFileDiv key={file.uuid}>
            <div>New file</div>
            <StyledLink
              onClick={(e) => {
                e.preventDefault();
                handleDownload(file.uuid, file.name);
              }}
            >
              {file.name}
            </StyledLink>
          </StyledFileDiv>
        ))
      ) : (
        <StyledP>Not received</StyledP>
      )}
    </StyledContainer>
  );
};

export default ListFilesWidget;
