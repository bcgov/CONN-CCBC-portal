import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

interface LinkProps {
  selected: boolean;
}

const StyledA = styled.a<LinkProps>`
  text-decoration: none;
  font-weight: 700;
  font-size: 32px;
  color: ${(props) => (props.selected ? props.theme.color.text : '#9B9B9B')};
  padding: 0px 16px;
  border-bottom: ${(props) => (props.selected ? '2px solid #000000' : 'none')};
`;

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 16px;
  padding-bottom: 3px;
`;

const DashboardTabs = () => {
  const router = useRouter();

  return (
    <StyledNav>
      <Link href="/analyst/dashboard" passHref>
        <StyledA selected={router?.pathname.startsWith('/analyst/dashboard')}>
          Dashboard
        </StyledA>
      </Link>
      <Link href="/analyst/admin/download-attachments" passHref>
        <StyledA selected={router?.pathname.startsWith('/analyst/admin')}>
          Administrative
        </StyledA>
      </Link>
    </StyledNav>
  );
};

export default DashboardTabs;
