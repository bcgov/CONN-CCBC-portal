import styled from 'styled-components';
import { useRouter } from 'next/router';
import {
  faCheckDouble,
  faChevronLeft,
  faClipboardList,
  faClockRotateLeft,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import NavItem from './NavItem';

const StyledAside = styled.aside`
  min-height: 100%;
`;

const StyledNav = styled.nav`
  position: sticky;
  top: 40px;
`;

const StyledUpperSection = styled.section`
  border-bottom: 1px solid #d6d6d6;
  color: ${(props) => props.theme.color.navigationBlue};
`;

const NavigationSidebar = () => {
  const router = useRouter();
  const { asPath } = router;
  const { applicationId } = router.query;

  return (
    <StyledAside>
      <StyledNav>
        <StyledUpperSection>
          <NavItem
            currentPath={asPath}
            href="/analyst/dashboard/"
            icon={faChevronLeft}
            label="Dashboard"
          />
        </StyledUpperSection>
        <section>
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}`}
            icon={faClipboardList}
            label="Application"
          />
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}/assessments`}
            icon={faCheckDouble}
            label="Assessments"
          />
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}/rfi`}
            icon={faEnvelope}
            label="RFI"
          />
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}/history`}
            icon={faClockRotateLeft}
            label="History"
          />
        </section>
      </StyledNav>
    </StyledAside>
  );
};

export default NavigationSidebar;
