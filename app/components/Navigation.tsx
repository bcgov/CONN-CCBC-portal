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
  padding-right: ${(props) => props.theme.padding.page};
`;
interface Props {
  isLoggedIn?: boolean;
  title?: string;
}

const Navigation: React.FC<Props> = ({ isLoggedIn = false, title = '' }) => {
  return (
    <BaseNavigation>
      <StyledBaseHeader>
        <StyledDiv>
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
            </Link>
            |
            <NavLoginForm
              action={isLoggedIn ? '/logout' : '/login'}
              linkText={isLoggedIn ? 'Logout' : 'Login'}
            />
          </StyledRightSideLinks>
        </StyledDiv>
      </StyledBaseHeader>
      <SubHeader />
    </BaseNavigation>
  );
};

export default Navigation;
