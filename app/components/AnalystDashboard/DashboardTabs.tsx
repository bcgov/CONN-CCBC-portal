import Link from 'next/link';
import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

interface LinkProps {
  isAdmin: boolean;
  selected: boolean;
}

const StyledA = styled.a<LinkProps>`
  text-decoration: none;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  font-size: 32px;
  color: ${(props) => (props.selected ? props.theme.color.text : '#9B9B9B')};
  padding: 0px 16px;
  border-bottom: ${(props) =>
    props.selected && props.isAdmin ? '2px solid #000000' : 'none'};

  &:hover {
    opacity: ${(props) => (props.selected ? `1` : `0.6`)};
  }
`;

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 24px;
  padding-bottom: 3px;
`;

const DashboardTabs = ({ session }) => {
  const queryFragment = useFragment(
    graphql`
      fragment DashboardTabs_query on KeycloakJwt {
        authRole
      }
    `,
    session
  );

  const { authRole } = queryFragment;
  const isAdmin = authRole === 'ccbc_admin';
  const router = useRouter();

  return (
    <StyledNav>
      <Link href="/analyst/dashboard" passHref>
        <StyledA
          isAdmin={isAdmin}
          selected={router?.pathname.startsWith('/analyst/dashboard')}
        >
          Dashboard
        </StyledA>
      </Link>
      {isAdmin && (
        <Link href="/analyst/admin/download-attachments" passHref>
          <StyledA
            isAdmin={isAdmin}
            selected={router?.pathname.startsWith('/analyst/admin')}
          >
            Administrative
          </StyledA>
        </Link>
      )}
    </StyledNav>
  );
};

export default DashboardTabs;
