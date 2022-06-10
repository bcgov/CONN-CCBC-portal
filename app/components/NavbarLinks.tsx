import Link from 'next/link';
import styled from 'styled-components';

const StyledLi = styled.li`
  display: flex;
  align-self: center;
`;

const StyledUl = styled.ul`
  padding-left: ${(props) => props.theme.padding.page};
`;

export const SubHeaderNavbarLinks: React.FC = () => {
  return (
    <StyledUl>
      <StyledLi>
        <Link href="mailto:connectingcommunitiesbc@gov.bc.ca">
          <a style={{ paddingLeft: 0 }}>Help</a>
        </Link>
      </StyledLi>
    </StyledUl>
  );
};
