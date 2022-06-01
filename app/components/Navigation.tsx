import { BaseNavigation } from '@button-inc/bcgov-theme/Navigation';
import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import { SubHeader, NavLoginForm } from '.';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

const StyledMainTitle = styled(BaseHeader.Item)`
  font-weight: normal;
  margin-top: 10px;
`;

const StyledRightSideLinks = styled(BaseHeader.Group)`
  margin-left: auto;
  margin-bottom: auto;
  margin-top: auto;
`;

const StyledAnchor = styled.a`
  color: white;
  margin: 0 10px 0 0;
  font-size: 0.8em;
  align-self: center;
`;

interface Props {
  isLoggedIn?: boolean;
  title?: string;
}

const Navigation: React.FC<Props> = ({ isLoggedIn = false, title = '' }) => {
  return (
    <BaseNavigation>
      <BaseHeader>
        <BaseHeader.Group className="banner">
          <Link passHref href="/">
            <a>
              <Image
                priority
                src="/icons/BCID_CC_RGB_rev.svg"
                alt="Logo for Province of British Columbia Connected Communities"
                height={100}
                width={300}
              />
            </a>
          </Link>
        </BaseHeader.Group>
        <StyledMainTitle>
          <h1>{title}</h1>
        </StyledMainTitle>
        <StyledRightSideLinks>
          <Link passHref href="/dashboard">
            <StyledAnchor>Dashboard</StyledAnchor>
          </Link>{' '}
          |
          <NavLoginForm
            action={isLoggedIn ? '/logout' : '/login'}
            linkText={isLoggedIn ? 'Logout' : 'Login'}
          />
          <NavLoginForm action={'/logout'} linkText={'Logout'} />
        </StyledRightSideLinks>
      </BaseHeader>
      <SubHeader />
    </BaseNavigation>
  );
};

export default Navigation;
