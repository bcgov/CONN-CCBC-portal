import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import { SubHeaderNavbarLinks } from '.';
import styled from 'styled-components';

const StyledDiv = styled('div')`
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  margin: auto;
`;

const SubHeader: React.FC = () => {
  return (
    <BaseHeader header="sub">
      <StyledDiv>
        <SubHeaderNavbarLinks />
      </StyledDiv>
    </BaseHeader>
  );
};

export default SubHeader;
