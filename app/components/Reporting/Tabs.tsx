import styled from 'styled-components';
import { useRouter } from 'next/router';
import { StyledTab } from 'components/Admin/AdminTabs';

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 8px;
`;

const Tabs = () => {
  const router = useRouter();
  const gcpeHref = '/analyst/reporting/gcpe';
  const manageReportsHref = '/analyst/reporting/manage-reports';
  // this a bare page to handle any future reporting tabs
  return (
    <StyledNav>
      <StyledTab href={gcpeHref} selected={router?.pathname.includes(gcpeHref)}>
        GCPE
      </StyledTab>
      <StyledTab
        href={manageReportsHref}
        selected={router?.pathname.includes(manageReportsHref)}
      >
        Manage Reports
      </StyledTab>
    </StyledNav>
  );
};

export default Tabs;
