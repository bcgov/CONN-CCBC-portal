import Link from 'next/link';
import styled from 'styled-components';
import GlobalTheme from '../styles/GlobalTheme';
import ExternalLink from '@button-inc/bcgov-theme/Link';

const StyledLi = styled.li`
  display: flex;
  align-self: center;
`;

const StyledUl = styled.ul`
  padding-left: ${(props) => props.theme.padding.page};
`;

export const SubHeaderNavbarLinks: React.FC = () => {
  return (
    <GlobalTheme>
      <StyledUl>
        <StyledLi>
          <Link href="/">
            <a>Home</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <ExternalLink href="mailto:connectingcommunitiesbc@gov.bc.ca">
            Email us
          </ExternalLink>
        </StyledLi>
      </StyledUl>
    </GlobalTheme>
  );
};
