import { WidgetProps } from '@rjsf/utils';
import Textarea from '@button-inc/bcgov-theme/Textarea';
import styled from 'styled-components';
import Label from 'components/Form/Label';

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
  margin-bottom: 16px !important;
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
    <StyledDiv className="textarea-widget">
      <StyledTextArea
        id={id}
        data-testid={id}
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
