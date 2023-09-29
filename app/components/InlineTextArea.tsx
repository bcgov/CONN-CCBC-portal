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
  max-height: ${({ isExpanded }) => (isExpanded ? '90px' : '70px')};
  transition: max-height 0.4s;
`;

const StyledText = styled.div`
  width: 100%;
  padding-top: 2px; // optical - so text doesn't shift between readonly/edit //
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

const StyledPlaceholder = styled(StyledText)`
  color: #ccc;
`;

const StyledInfo = styled(StyledPlaceholder)`
  cursor: default;
  font-size: 12px;
`;

const StyledTextArea = styled.textarea<AnimateProps>`
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

  const handleEdit = () => {
    setIsEditing(true);
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
          ref={(ref) => ref && ref.focus()}
          // set cursor position to end of text
          onFocus={(e) =>
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length
            )
          }
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
            <StyledText onClick={handleEdit}>{text}</StyledText>
          ) : (
            <StyledPlaceholder onClick={handleEdit}>
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
