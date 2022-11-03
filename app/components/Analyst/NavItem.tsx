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
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.navigationLightGrey};
  }
`;

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

const StyledIconContainer = styled.div`
  width: 12px;
`;

const StyledLabelContainer = styled.div`
  padding-left: 8px;
  display: none;

  ${(props) => props.theme.breakpoint.largeUp} {
    display: block;
  }
`;

const NavItem: React.FC<Props> = ({ currentPath, href, icon, label }) => {
  const selectedColour = currentPath === href ? '#F1F2F3' : 'inherit';

  return (
    <Link href={href} passHref>
      <StyledLink>
        <StyledNavItem selected={selectedColour}>
          <StyledIconContainer>
            <FontAwesomeIcon icon={icon} fixedWidth aria-hidden="true" />
          </StyledIconContainer>
          <StyledLabelContainer>{label}</StyledLabelContainer>
        </StyledNavItem>
      </StyledLink>
    </Link>
  );
};

export default NavItem;
