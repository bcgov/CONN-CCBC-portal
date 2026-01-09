import styled from 'styled-components';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import {
  faChartGantt,
  faCheckDouble,
  faChevronLeft,
  faClipboardList,
  faClockRotateLeft,
  faEnvelope,
  faNoteSticky,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import useStickyHeader from 'lib/helpers/useStickyHeader';
import NavItem from './NavItem';
import SideMap from './SideMap';
import ProjectNavigationSidebar from './ProjectNavigationSidebar';

const StyledAside = styled.aside`
  min-height: 100%;
  min-width: 300px;
  @media (max-width: 1250px) {
    margin-left: 60px;
  }
  @media (max-width: 975px) {
    margin-left: 180px;
  }
`;

const StyledNav = styled.nav<{ $offset: number }>`
  position: sticky;
  top: ${({ $offset }) => `${$offset + 140}px`};
`;

const StyledUpperSection = styled.section`
  border-bottom: 1px solid #d6d6d6;
  color: ${(props) => props.theme.color.navigationBlue};
  padding-top: 45px;
`;

const StyledLowerSection = styled.section`
  margin-top: 1em;
`;

const NavigationSidebar = ({
  mapData = null,
  isMapExpanded = null,
  setIsMapExpanded = null,
  query = null, // Add query prop for project navigation
}) => {
  const router = useRouter();
  const { extraOffset } = useStickyHeader();
  const { asPath } = router;
  const { applicationId } = router.query;
  const assessmentLastVisited = cookie.get('assessment_last_visited') || null;

  useEffect(() => {
    if (!assessmentLastVisited) {
      sessionStorage.setItem(
        'mrt_last_visited_row_application',
        JSON.stringify({ isCcbc: true, rowId: applicationId })
      );
    }
  }, [applicationId, assessmentLastVisited]);

  return (
    <StyledAside>
      <StyledNav $offset={extraOffset}>
        <StyledUpperSection>
          <ProjectNavigationSidebar query={query} />
          <NavItem
            currentPath={asPath}
            href={
              assessmentLastVisited
                ? '/analyst/assessments/'
                : '/analyst/dashboard'
            }
            icon={faChevronLeft}
            label="Dashboard"
          />
        </StyledUpperSection>
        <StyledLowerSection>
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}/summary`}
            icon={faNoteSticky}
            label="Summary"
          />
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
            href={`/analyst/application/${applicationId}/project`}
            icon={faChartGantt}
            label="Project"
          />
          <NavItem
            currentPath={asPath}
            href={`/analyst/application/${applicationId}/history`}
            icon={faClockRotateLeft}
            label="History"
          />
        </StyledLowerSection>
        {asPath.includes('summary') && mapData && (
          <SideMap
            mapData={mapData}
            isMapExpanded={isMapExpanded}
            setIsMapExpanded={setIsMapExpanded}
          />
        )}
      </StyledNav>
    </StyledAside>
  );
};

export default NavigationSidebar;
