import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useFeature } from '@growthbook/growthbook-react';
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

  const showAssessmentsTab = useFeature(
    'show_assessment_assignment_table'
  ).value;
  const showChangeLogTab = useFeature('show_project_change_log_table').value;

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
          Project Change Log
        </StyledTab>
      )}
    </StyledNav>
  );
};

export default TableTabs;
