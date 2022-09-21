import styled from 'styled-components';

export const StyledTitleRow = styled('th')`
  padding: 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
`;

export const StyledH4 = styled('h4')`
  margin: 0;
`;

export const StyledColLeft = styled('th')`
  // Todo: workaround for Jest styled component theme prop error
  // background-color: ${(props) => props.theme.color.backgroundGrey};
  background-color: '#F2F2F2';
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
`;

export const StyledColRight = styled('td')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
`;

export const StyledColError = styled(StyledColRight)`
  background-color: rgba(248, 214, 203, 0.4);
  // background-color: ${(props) => props.theme.color.errorBackground};
`;
