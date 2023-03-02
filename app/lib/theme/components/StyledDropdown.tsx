import { Dropdown } from '@button-inc/bcgov-theme';
import styled from 'styled-components';

const StyledSelect = styled(Dropdown)`
  .pg-select-wrapper {
    margin: 12px 0;
    width: ${(props) => props.theme.width.inputWidthSmall};
  }
  .pg-select-wrapper:after {
    margin: 0.3em 0;
  }
  & select {
    margin: 0.25em 0;
  }

  select:disabled {
    background: inherit;
    border: 1px solid rgba(96, 96, 96, 0.3);
    opacity: 0;
  }

  & div:first-child {
    background: ${(props) => props.disabled && 'rgba(196, 196, 196, 0.3)'};
    border: ${(props) => props.disabled && ' 1px solid rgba(96, 96, 96, 0.3)'};
  }
`;

export default StyledSelect;
