import { WidgetProps } from '@rjsf/core';
import { Label } from '../../../components/Form';
import Textarea from '@button-inc/bcgov-theme/Textarea';
import styled from 'styled-components';

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
  const description = uiSchema['ui:description'];

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
        size={'medium'}
        resize="vertical"
        required={required}
        aria-label={label}
        maxLength={maxLength}
      />
      {description && <Label>{description}</Label>}
    </StyledDiv>
  );
};

export default TextAreaWidget;
