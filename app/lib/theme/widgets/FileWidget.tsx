import { MutableRefObject, useRef } from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import React from 'react';

const StyledContainer = styled('div')`
  margin-top: 16px;
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px;
`;

const StyledDetails = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledH4 = styled('h4')`
  margin: 0;
`;

const StyledLink = styled('a')`
  color: ${(props) => props.theme.color.links};
  margin: 8px 0;
  text-decoration-line: underline;
`;

const FileWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  value,
  required,
  uiSchema,
}) => {
  // Todo: make FileWidget upload files, have validations and support multiple file uploads
  //       and custom file types per field
  const description = uiSchema['ui:description'];
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;

  const handleChange = (e: any) => {
    onChange(e.target.files[0].name || undefined);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <StyledContainer>
      <StyledDetails>
        <StyledH4>{description}</StyledH4>
        {value && <StyledLink>{value}</StyledLink>}
      </StyledDetails>
      <Button
        id={`${id}-btn`}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          e.preventDefault();
          handleClick();
        }}
      >
        Upload
      </Button>
      <input
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
        type="file"
        required={required}
      />
    </StyledContainer>
  );
};

export default FileWidget;
