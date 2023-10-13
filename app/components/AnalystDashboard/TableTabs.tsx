import styled from 'styled-components';
import { useRouter } from 'next/router';
import { StyledTab } from 'components/Admin/AdminTabs';

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 8px;
`;

const TableTabs = () => {
  const router = useRouter();
  const dashboardHref = '/analyst/dashboard';
  const assessmentsHref = '/analyst/assessments';

  return (
    <StyledNav>
      <StyledTab
        href={dashboardHref}
        selected={router?.pathname.includes(dashboardHref)}
      >
        All
      </StyledTab>
      <StyledTab
        href={assessmentsHref}
        passHref
        selected={router?.pathname.includes(assessmentsHref)}
      >
        Assessments
      </StyledTab>
    </StyledNav>
  );
};

export default TableTabs;
