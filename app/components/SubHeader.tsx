import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import styled from 'styled-components';
import SubHeaderNavbarLinks from './NavbarLinks';

const StyledDiv = styled('div')`
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  margin: auto;
`;

const SubHeader: React.FC = () => (
  <BaseHeader header="sub">
    <StyledDiv>
      <SubHeaderNavbarLinks />
    </StyledDiv>
  </BaseHeader>
);

export default SubHeader;
