import Link from 'next/link';
import styled from 'styled-components';
import ExternalLink from '@button-inc/bcgov-theme/Link';
import GlobalTheme from '../styles/GlobalTheme';

const StyledLi = styled.li`
  display: flex;
  align-self: center;
`;

const StyledUl = styled.ul`
  padding-left: ${(props) => props.theme.spacing.large};
`;

const SubHeaderNavbarLinks: React.FC = () => (
  <GlobalTheme>
    <StyledUl>
      <StyledLi>
        <Link href="/">Home</Link>
      </StyledLi>
      <StyledLi>
        <ExternalLink href="mailto:connectingcommunitiesbc@gov.bc.ca">
          Email us
        </ExternalLink>
      </StyledLi>
    </StyledUl>
  </GlobalTheme>
);
export default SubHeaderNavbarLinks;
