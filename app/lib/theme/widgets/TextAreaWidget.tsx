import { WidgetProps } from '@rjsf/core';
import Textarea from '@button-inc/bcgov-theme/Textarea';
import styled from 'styled-components';

const StyledTextArea = styled(Textarea)`
  & textarea {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthFull};
    min-height: 10rem;
  }
`;

const TextAreaWidget: React.FC<WidgetProps> = ({
  id,
  placeholder,
  onChange,
  label,
  value,
  required,
}) => {
  return (
    <div>
      <StyledTextArea
        id={id}
        onChange={(e: { target: { value: string } }) =>
          onChange(e.target.value || undefined)
        }
        placeholder={placeholder}
        value={value || ''}
        size={'medium'}
        resize="vertical"
        required={required}
        aria-label={label}
      />
    </div>
  );
};

export default TextAreaWidget;
