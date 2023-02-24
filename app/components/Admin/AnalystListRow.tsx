import { useState } from 'react';
import styled from 'styled-components';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';

const StyledTd = styled.td`
  border: 1px #b9b9b9 solid;
`;

const StyledContainer = styled.div`
  max-width: 16px;
  margin-left: 2rem;
`;
interface Props {
  analystName: any;
  active: boolean;
}

const AnalystListRow: React.FC<Props> = ({ active, analystName }) => {
  const [checked, setChecked] = useState(active);
  return (
    <tr key={analystName}>
      <StyledTd>{analystName}</StyledTd>
      <StyledTd>
        <StyledContainer>
          <Checkbox
            checked={checked}
            onChange={() => {
              setChecked(!checked);
            }}
          />
        </StyledContainer>
      </StyledTd>
    </tr>
  );
};

export default AnalystListRow;
