import Input from '@button-inc/bcgov-theme/Input';
import styled from 'styled-components';

interface ErrorProps {
  isError: boolean | string;
}

export const StyledInput = styled(Input)`
  & input {
    margin-top: 12px;
    margin-bottom: 4px;
    min-width: 100%;
    padding: 9px;
    border: ${(props) =>
      props.isError ? '2px solid #E71F1F' : '2px solid #606060'};
  }

  ${(props) => props.theme.breakpoint.largeUp} {
    & input {
      min-width: 240px;
    }
  }

  input:focus {
    outline: ${(props) =>
      props.isError ? '4px solid #E71F1F' : '4px solid #3B99FC'};
  }

  input:disabled {
    background: rgba(196, 196, 196, 0.3);
    border: 1px solid rgba(96, 96, 96, 0.3);
  }
`;

export const StyledDiv = styled.div`
  position: relative;
  margin: 8px 0;
`;

export const StyledError = styled.div<ErrorProps>`
  color: #e70f1f;
  max-height: ${(props) => (props.isError ? '20px' : '0px')};

  transition: max-height 0.5s ease-in-out;
  overflow: hidden;

  ${(props) => props.theme.breakpoint.largeUp} {
    position: absolute;
    max-height: 40px;
    white-space: nowrap;
    overflow: visible;
  }
`;

export { StyledInput as Input, StyledDiv as Div, StyledError as Error };
