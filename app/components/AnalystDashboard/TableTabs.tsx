import styled from 'styled-components';
import { useRouter } from 'next/router';
import useDeferredFeature from 'lib/helpers/useDeferredFeature';
import { StyledTab } from 'components/Admin/AdminTabs';

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 8px;
`;

const TableTabs = () => {
  const router = useRouter();
  const dashboardHref = '/analyst/dashboard';
  const assessmentsHref = '/analyst/assessments';
  const changeLogHref = '/analyst/change-log';

  const showAssessmentsTab = useDeferredFeature(
    'show_assessment_assignment_table'
  );
  const showChangeLogTab = useDeferredFeature('show_project_change_log_table');

  return (
    <StyledNav>
      <StyledTab
        href={dashboardHref}
        selected={router?.pathname.includes(dashboardHref)}
      >
        All
      </StyledTab>

      {showAssessmentsTab && (
        <StyledTab
          href={assessmentsHref}
          passHref
          selected={router?.pathname.includes(assessmentsHref)}
        >
          Assessments
        </StyledTab>
      )}

      {showChangeLogTab && (
        <StyledTab
          href={changeLogHref}
          passHref
          selected={router?.pathname.includes(changeLogHref)}
        >
          Change Log
        </StyledTab>
      )}
    </StyledNav>
  );
};

export default TableTabs;
