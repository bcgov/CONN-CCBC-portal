import { WidgetProps } from '@rjsf/core';
import Textarea from '@button-inc/bcgov-theme/Textarea';
import styled from 'styled-components';
import { Label } from '../../../components/Form';

const INPUT_MAX_LENGTH = 32000;

const StyledTextArea = styled(Textarea)`
  & textarea {
    margin-top: 12px;
    margin-bottom: 4px;
    width: ${(props) => props.theme.width.inputWidthFull};
    min-height: 129px;
  }
  textarea:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 32px;
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
  const maxLength = uiSchema['ui:options']?.maxLength;
  const help = uiSchema['ui:help'];

  return (
    <StyledDiv>
      <StyledTextArea
        id={id}
        disabled={disabled}
        onChange={(e: { target: { value: string } }) =>
          onChange(e.target.value || undefined)
        }
        placeholder={placeholder}
        value={value || ''}
        size="medium"
        resize="vertical"
        required={required}
        aria-label={label}
        maxLength={maxLength || INPUT_MAX_LENGTH}
      />
      {help && <Label>{help}</Label>}
    </StyledDiv>
  );
};

export default TextAreaWidget;
