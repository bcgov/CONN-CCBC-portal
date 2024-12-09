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
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
`;

interface StyledColRightProps {
  errorColor?: string;
  errorTextColor?: string;
  hasError?: boolean;
}

export const StyledColRight = styled('td')<StyledColRightProps>`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
  background-color: ${(props) =>
    props.hasError &&
    (props?.errorColor ? props.errorColor : props.theme.color.errorBackground)};
  color: ${(props) => props?.errorTextColor || 'inherit'};

  .pg-select-wrapper {
    background-color: white !important;
  }
`;
