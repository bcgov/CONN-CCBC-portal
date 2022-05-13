import Link from 'next/link';
import styled from 'styled-components';

const StyledLi = styled.li`
  display: flex;
  align-self: center;
`;

export default function NavbarLinks() {
  return (
    <ul>
      <StyledLi>
        <Link href="mailto:connectingcommunitiesbc@gov.bc.ca">
          <a>Help</a>
        </Link>
      </StyledLi>
    </ul>
  );
}
