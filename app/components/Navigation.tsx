import { useRouter } from 'next/router';
import { BaseNavigation } from '@button-inc/bcgov-theme/Navigation';
import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { IDP_HINTS, IDP_HINT_PARAM } from 'data/ssoConstants';
import { useFeature } from '@growthbook/growthbook-react';
import SubHeader from './SubHeader';
import NavLoginForm from './NavLoginForm';
import HeaderBanner from './HeaderBanner';

const StyledMainTitle = styled(BaseHeader.Item)`
  font-weight: normal;
  margin-top: 10px;
`;

const StyledBaseNavigation = styled(BaseNavigation)`
  position: sticky;
  z-index: 999;
  top: 0px;
`;

const StyledRightSideLinks = styled(BaseHeader.Group)`
  margin-left: auto;
  margin-bottom: auto;
  margin-top: auto;
`;

const StyledLink = styled(Link)`
  color: white;
  margin: 0 10px 0 0;
  font-size: 0.8em;
  align-self: center;
`;

const StyledDiv = styled('div')`
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-apart;
  margin: auto;
`;

const StyledBaseHeader = styled(BaseHeader)`
  padding-right: ${(props) => props.theme.spacing.large};
`;
interface Props {
  isLoggedIn?: boolean;
  title?: string;
}

const Navigation: React.FC<Props> = ({ isLoggedIn = false, title = '' }) => {
  const router = useRouter();
  const isApplicantPortal = router?.pathname.startsWith('/applicantportal');
  const useNewHeader = useFeature('use_new_header').value;
  const { value: banner } = useFeature('header-banner');

  const action = `/api/login/${IDP_HINT_PARAM}=${IDP_HINTS['IDIR']}`;

  return (
    <StyledBaseNavigation>
      {banner && (
        <HeaderBanner
          type={banner.type}
          message={banner.message}
          environmentIndicator={banner['environment-indicator']}
        />
      )}
      <StyledBaseHeader>
        <StyledDiv>
          <BaseHeader.Group className="banner">
            <Link passHref href="/">
              <Image
                style={{ cursor: 'pointer', marginBottom: 0 }}
                priority
                src={
                  useNewHeader
                    ? '/icons/connectivity_portal.svg'
                    : '/icons/BCID_CC_RGB_rev.svg'
                }
                alt="Logo for Province of British Columbia Connected Communities"
                height={100}
                width={300}
              />
            </Link>
          </BaseHeader.Group>
          <StyledMainTitle>
            <h1>{title}</h1>
          </StyledMainTitle>
          <StyledRightSideLinks>
            {isLoggedIn && isApplicantPortal && (
              <>
                <StyledLink
                  passHref
                  href="/applicantportal/dashboard"
                  data-testid="dashboard-btn-test"
                >
                  Dashboard
                </StyledLink>
                |
              </>
            )}
            <NavLoginForm
              action={isLoggedIn ? '/api/logout' : action}
              linkText={isLoggedIn ? 'Logout' : 'Login'}
            />
          </StyledRightSideLinks>
        </StyledDiv>
      </StyledBaseHeader>
      {isApplicantPortal && <SubHeader />}
    </StyledBaseNavigation>
  );
};

export default Navigation;
