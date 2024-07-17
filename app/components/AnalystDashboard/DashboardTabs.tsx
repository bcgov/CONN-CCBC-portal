import Link from 'next/link';
import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';
import { useFeature } from '@growthbook/growthbook-react';

interface LinkProps {
  isAdmin: boolean;
  selected: boolean;
}

const StyledLink = styled(Link)<LinkProps>`
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
  const showGisUpload = useFeature('show_gis_upload').value;
  const showReporting = useFeature('show_reporting').value;
  return (
    <StyledNav>
      <StyledLink
        href="/analyst/dashboard"
        passHref
        isAdmin={isAdmin}
        selected={
          router?.pathname.startsWith('/analyst/dashboard') ||
          router?.pathname.startsWith('/analyst/assessments')
        }
      >
        Dashboard
      </StyledLink>
      {isAdmin && (
        <StyledLink
          href="/analyst/admin/download-attachments"
          passHref
          isAdmin={isAdmin}
          selected={router?.pathname.startsWith('/analyst/admin')}
        >
          Administrative
        </StyledLink>
      )}
      {showGisUpload && (
        <StyledLink
          href="/analyst/gis"
          passHref
          isAdmin={isAdmin}
          selected={router?.pathname.startsWith('/analyst/gis')}
        >
          GIS
        </StyledLink>
      )}
      {showReporting && (
        <StyledLink
          href="/analyst/reporting/gcpe"
          passHref
          isAdmin={isAdmin}
          selected={router?.pathname.startsWith('/analyst/reporting')}
        >
          Reporting
        </StyledLink>
      )}
    </StyledNav>
  );
};

export default DashboardTabs;
