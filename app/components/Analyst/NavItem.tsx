import Link from 'next/link';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  href?: string;
  icon?: any;
  label: string;
  currentPath: string;
}

interface StyledProps {
  selected: any;
}

const StyledNavItem = styled.div<StyledProps>`
  margin: 4px 0;
  padding: 8px;
  display: flex;
  border-radius: 4px;
  background-color: ${(p) => p.selected};

  &:hover {
    background-color: #f8f8f8;
  }
`;

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
  padding-left: 8px;
`;

const StyledIconContainer = styled.div`
  width: 12px;
`;

const StyledLinkContainer = styled.div`
  display: none;

  ${(props) => props.theme.breakpoint.mediumUp} {
    display: block;
  }
`;

const NavItem: React.FC<Props> = ({ currentPath, href, icon, label }) => {
  const selectedColour = currentPath === href ? '#F1F2F3' : 'inherit';

  return (
    <StyledNavItem selected={selectedColour}>
      <StyledIconContainer>
        <FontAwesomeIcon icon={icon} fixedWidth aria-hidden="true" />
      </StyledIconContainer>
      <StyledLinkContainer>
        <Link href={href} passHref>
          <StyledLink>{label}</StyledLink>
        </Link>
      </StyledLinkContainer>
    </StyledNavItem>
  );
};

export default NavItem;
