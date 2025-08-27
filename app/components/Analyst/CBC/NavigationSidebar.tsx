import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  faChevronLeft,
  faClipboardList,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import useStickyHeader from 'lib/helpers/useStickyHeader';
import NavItem from '../NavItem';
import ProjectNavigationSidebar from '../ProjectNavigationSidebar';

const StyledAside = styled.aside`
  min-height: 100%;
`;

const StyledNav = styled.nav<{ $offset: number }>`
  position: sticky;
  top: ${({ $offset }) => `${$offset + 140}px`};
`;

const StyledUpperSection = styled.section`
  border-bottom: 1px solid #d6d6d6;
  color: ${(props) => props.theme.color.navigationBlue};
`;

const NavigationSidebar = ({ query = null }) => {
  const router = useRouter();
  const { extraOffset } = useStickyHeader();
  const { asPath } = router;
  const { cbcId } = router.query;

  useEffect(() => {
    sessionStorage.setItem(
      'mrt_last_visited_row_application',
      JSON.stringify({ isCcbc: false, rowId: cbcId })
    );
  }, [cbcId]);

  return (
    <StyledAside>
      <StyledNav $offset={extraOffset}>
        {/* Project Navigation Components - always show when query is available */}
        {query && <ProjectNavigationSidebar query={query} />}

        <StyledUpperSection>
          <NavItem
            currentPath={asPath}
            href="/analyst/dashboard"
            icon={faChevronLeft}
            label="Dashboard"
          />
        </StyledUpperSection>
        <section>
          <NavItem
            currentPath={asPath}
            href={`/analyst/cbc/${cbcId}`}
            icon={faClipboardList}
            label="Project"
          />
          <NavItem
            currentPath={asPath}
            href={`/analyst/cbc/${cbcId}/cbcHistory`}
            icon={faClockRotateLeft}
            label="History"
          />
        </section>
      </StyledNav>
    </StyledAside>
  );
};

export default NavigationSidebar;
