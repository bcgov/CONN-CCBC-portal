import styled from 'styled-components';

export const StyledTitleRow = styled('th')`
  padding: 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
`;

export const StyledH4 = styled('h4')`
  margin: 0;
`;

export const StyledColLeft = styled('th')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  border-top: 0;
  border-bottom: 0;
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
  tr:last-child & {
    border-bottom: 1px solid rgba(0, 0, 0, 0.16);
  }
  tr:first-child & {
    border-top: 1px solid rgba(0, 0, 0, 0.16);
  }
`;

interface StyledColRightProps {
  errorColor?: string;
  errorTextColor?: string;
  hasError?: boolean;
  hideColLeft?: boolean;
}

export const StyledColRight = styled('td')<StyledColRightProps>`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-top: 0;
  border-bottom: 0;
  border-right: 0;
  border-left: ${(props) => (props?.hideColLeft ? '0 !important' : 'inherit')};
  font-weight: 400;
  white-space: pre-line;
  background-color: ${(props) =>
    props.hasError &&
    (props?.errorColor ? props.errorColor : props.theme.color.errorBackground)};
  color: ${(props) => props?.errorTextColor || 'inherit'};

  .pg-select-wrapper {
    background-color: white !important;
  }
  tr:last-child & {
    border-bottom: 1px solid rgba(0, 0, 0, 0.16);
  }
  tr:first-child & {
    border-top: 1px solid rgba(0, 0, 0, 0.16);
  }
`;
