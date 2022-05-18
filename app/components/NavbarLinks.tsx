import Link from 'next/link';
import styled from 'styled-components';

const StyledLi = styled.li`
  display: flex;
  align-self: center;
`;

const StlyedUl = styled.ul`
  padding-left: 15px;
`;

export const SubHeaderNavbarLinks: React.FC = () => {
  return (
    <StlyedUl>
      <StyledLi>
        <Link href="mailto:connectingcommunitiesbc@gov.bc.ca">
          <a>Help</a>
        </Link>
      </StyledLi>
    </StlyedUl>
  );
};
