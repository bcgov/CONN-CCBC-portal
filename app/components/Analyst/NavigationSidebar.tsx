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
import NavItem from './NavItem';
import SideMap from './SideMap';

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

const StyledLowerSection = styled.section`
  margin-top: 1em;
`;

const NavigationSidebar = ({
  mapData = null,
  isMapExpanded = null,
  setIsMapExpanded = null,
}) => {
  const router = useRouter();
  const { asPath } = router;
  const { applicationId } = router.query;
  const assessmentLastVisited = cookie.get('assessment_last_visited') || null;
  return (
    <StyledAside>
      <StyledNav>
        <StyledUpperSection>
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
