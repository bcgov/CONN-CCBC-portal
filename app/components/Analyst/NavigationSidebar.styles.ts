import styled from 'styled-components';

export const StyledAside = styled.aside`
  min-height: 100%;
  min-width: 300px;
  @media (max-width: 1250px) {
    margin-left: 60px;
  }
  @media (max-width: 975px) {
    margin-left: 180px;
  }
`;

export const StyledNav = styled.nav<{ $offset: number }>`
  position: sticky;
  top: ${({ $offset }) => `${$offset + 140}px`};
`;

export const StyledUpperSection = styled.section`
  border-bottom: 1px solid #d6d6d6;
  color: ${(props) => props.theme.color.navigationBlue};
  padding-top: 45px;
`;

export const StyledLowerSection = styled.section`
  margin-top: 1em;
`;

