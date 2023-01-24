import { useRouter } from 'next/router';
import { BaseNavigation } from '@button-inc/bcgov-theme/Navigation';
import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import SubHeader from './SubHeader';
import NavLoginForm from './NavLoginForm';

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

  return (
    <BaseNavigation>
      <StyledBaseHeader>
        <StyledDiv>
          <BaseHeader.Group className="banner">
            <Link passHref href="/">
              <a>
                <Image
                  style={{ cursor: 'pointer' }}
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
            {isLoggedIn && isApplicantPortal && (
              <>
                <Link passHref href="/applicantportal/dashboard">
                  <StyledAnchor data-testid="dashboard-btn-test">
                    Dashboard
                  </StyledAnchor>
                </Link>
                |
              </>
            )}
            <NavLoginForm
              action={isLoggedIn ? '/api/logout' : '/api/login/multi-auth'}
              linkText={isLoggedIn ? 'Logout' : 'Login'}
            />
          </StyledRightSideLinks>
        </StyledDiv>
      </StyledBaseHeader>
      {isApplicantPortal && <SubHeader />}
    </BaseNavigation>
  );
};

export default Navigation;
