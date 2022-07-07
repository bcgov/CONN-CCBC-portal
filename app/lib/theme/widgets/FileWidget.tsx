import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';
import React from 'react';

const StyledContainer = styled('div')`
  margin-top: 16px;
  margin-bottom: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 16px;
`;

const StyledDetails = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledH4 = styled('h4')`
  margin: 0;
`;

const StyledLink = styled('a')`
  color: ${(props) => props.theme.color.links};
  margin: 8px 0;
  text-decoration-line: underline;
`;

type File = {
  name: string;
  size: number;
  type: string;
};

const FileWidget: React.FC<WidgetProps> = ({
  id,
  onChange,
  value,
  required,
  uiSchema,
}) => {
  console.log(uiSchema);
  const [fileList, setFileList] = useState<File[]>([]);
  const description = uiSchema['ui:description'];
  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const allowMultipleFiles = uiSchema['ui:options']?.allowMultipleFiles;

  useEffect(() => {
    // Set state from value stored in RJSF if it exists
    value && setFileList(JSON.parse(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update value in RJSF with useEffect instead of handleChange due to async setState delay
    onChange(JSON.stringify(fileList) || undefined);
  }, [fileList, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { name, size, type } = file;

      const fileDetails = {
        name: name,
        size: size,
        type: type,
      };
      if (allowMultipleFiles) {
        setFileList((prev) => [...prev, fileDetails]);
      } else {
        setFileList([fileDetails]);
      }
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <StyledContainer>
      <StyledDetails>
        <StyledH4>{description}</StyledH4>
        {fileList.length > 0 &&
          fileList.map((file: File, i) => {
            return <StyledLink key={file.name + i}>{file.name}</StyledLink>;
          })}
      </StyledDetails>
      <div>
        <Button
          id={`${id}-btn`}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {!allowMultipleFiles && fileList.length > 0 ? 'Replace' : 'Upload'}
        </Button>
      </div>
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
