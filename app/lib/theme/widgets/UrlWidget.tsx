import { WidgetProps } from '@rjsf/core';
import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    min-width: 50%;
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    & input {
      min-width: 240px;
    }
  }

  &input: focus {
    outline: ${(props) =>
      props.error ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }
  input:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
  }
`;

const StyledDiv = styled('div')`
  margin-bottom: 8px;

  .url-error {
    display: none;
    color: #e70f1f;
    &::after {
      content: '.';
      visibility: hidden;
    }
  }

  & input:invalid + .url-error {
    display: block;
  }
`;

const UrlWidget: React.FC<WidgetProps> = (props) => {
  const { id, placeholder, disabled, onChange, label, value, required } = props;

  return (
    <StyledDiv>
      <StyledInput
        type="url"
        id={id}
        disabled={disabled}
        data-testid={id}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value ?? ''}
        min={0}
        size="medium"
        required={required}
        aria-label={label}
      />
      <div className="url-error">Invalid URL</div>
    </StyledDiv>
  );
};

export default UrlWidget;
