import React, { useState } from 'react';
import styled from 'styled-components';

interface AnimateProps {
  isExpanded: boolean;
}

const StyledContainer = styled.div<AnimateProps>`
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  height: 100px;
  max-height: ${({ isExpanded }) => (isExpanded ? '90px' : '20px')};
  transition: max-height 0.4s;
`;

const StyledText = styled.div`
  cursor: pointer;
  width: 100%;
`;

const StyledPlaceholder = styled(StyledText)`
  color: #ccc;
  cursor: pointer;
`;

const StyledInfo = styled(StyledPlaceholder)`
  font-size: 12px;
`;

const StyledTextArea = styled.textarea<AnimateProps>`
  padding: 8px;
  border: 1px solid #ccc;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  max-height: ${({ isExpanded }) => (isExpanded ? '90px' : '20px')};
  transition: max-height 0.4s;

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.color.links};
  }
`;

interface TextAreaProps {
  value: string;
  onSubmit: (value: string) => void;
}

const InlineTextArea: React.FC<TextAreaProps> = ({ value, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value || '');

  const handleBlur = () => {
    setIsEditing(false);
    onSubmit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onSubmit(text);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value);
    }
  };

  return (
    <StyledContainer isExpanded={isEditing}>
      {isEditing ? (
        <StyledTextArea
          isExpanded={isEditing}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={320}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          {value ? (
            <StyledText onClick={() => setIsEditing(true)}>{text}</StyledText>
          ) : (
            <StyledPlaceholder onClick={() => setIsEditing(true)}>
              Click to edit project description
            </StyledPlaceholder>
          )}
        </>
      )}

      {isEditing && (
        <StyledInfo>{`${320 - text.length} characters remaining`}</StyledInfo>
      )}
    </StyledContainer>
  );
};

export default InlineTextArea;
