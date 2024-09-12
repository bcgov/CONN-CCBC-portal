import styled from 'styled-components';
import { useRouter } from 'next/router';
import { StyledTab } from 'components/Admin/AdminTabs';

const StyledNav = styled.nav`
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 8px;
`;

const Tabs = () => {
  const router = useRouter();
  const gisRef = '/analyst/gis';
  const coveragesRef = '/analyst/gis/coverages';

  return (
    <StyledNav>
      <StyledTab
        href={gisRef}
        selected={
          router?.pathname.includes(gisRef) &&
          !router.pathname.includes(coveragesRef)
        }
      >
        GIS Input
      </StyledTab>
      <StyledTab
        href={coveragesRef}
        selected={router?.pathname.includes(coveragesRef)}
      >
        Application Coverages Upload
      </StyledTab>
    </StyledNav>
  );
};

export default Tabs;
