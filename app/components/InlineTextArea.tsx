import React, { useState } from 'react';
import styled from 'styled-components';

interface AnimateProps extends React.PropsWithChildren<any> {
  isExpanded: boolean;
}

const StyledContainer = styled.div<AnimateProps>`
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  height: 100px;
  max-height: ${({ isExpanded }) => (isExpanded ? '86px' : '70px')};
  transition: max-height 0.4s;
`;

const StyledText = styled.div`
  width: 100%;
  cursor: pointer;
  padding-top: 2px;
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
  height: 24px;
`;

const StyledTextArea = styled.textarea<AnimateProps>`
  border: 1px solid #ccc;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  max-height: ${({ isExpanded }) => (isExpanded ? '92px' : '20px')};
  transition: max-height 0.4s;

  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.color.links};
  }
`;

interface TextAreaProps {
  isEditing: boolean;
  value: string;
  onSubmit: (value: string) => void;
  setIsEditing: (value: boolean) => void;
  placeholder?: string;
}

const InlineTextArea: React.FC<TextAreaProps> = ({
  isEditing,
  placeholder,
  value,
  onSubmit,
  setIsEditing,
}) => {
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
      e.preventDefault();
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
            <StyledText as="div" onClick={handleEdit}>
              {text}
            </StyledText>
          ) : (
            <StyledPlaceholder as="div" onClick={handleEdit}>
              {placeholder || 'Click to edit'}
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
