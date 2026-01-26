import { WidgetProps } from '@rjsf/utils';
import Textarea from '@button-inc/bcgov-theme/Textarea';
import styled from 'styled-components';
import Label from 'components/Form/Label';
import { useState } from 'react';

const INPUT_MAX_LENGTH = 32000;

const StyledTextArea = styled(Textarea)`
  & textarea {
    margin-top: 8px;
    width: ${(props) => props.theme.width.inputWidthFull};
    min-height: 129px;
    resize: both;
  }
  textarea:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
  }
  textarea::placeholder {
    color: ${(props) => props.theme.color.placeholder};
  }
`;

const StyledDiv = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px !important;
`;

const StyledHint = styled.span`
  display: block;
  color: ${(props) => props.theme.color.darkGrey};
  font-style: italic;
  font-size: 13px;
`;

const TextAreaWidget: React.FC<WidgetProps> = ({
  disabled,
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
  uiSchema,
}) => {
  const maxLength =
    parseInt(String(uiSchema['ui:options']?.maxLength), 10) || INPUT_MAX_LENGTH;
  const help = uiSchema['ui:help'];
  const showCharacterCount = uiSchema['ui:options']?.showCharacterCount ?? true;

  const [characterCount, setCharacterCount] = useState(
    value ? value.length : 0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue || undefined);
    setCharacterCount(inputValue.length);
  };

  return (
    <StyledDiv className="textarea-widget">
      <StyledTextArea
        id={id}
        data-testid={id}
        disabled={disabled}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={value || ''}
        size="medium"
        resize="vertical"
        required={required}
        aria-label={label}
        maxLength={maxLength}
      />

      {showCharacterCount && !disabled && (
        <Label>{maxLength - characterCount} characters remaining</Label>
      )}
      {help && <StyledHint>{help}</StyledHint>}
    </StyledDiv>
  );
};

export default TextAreaWidget;
