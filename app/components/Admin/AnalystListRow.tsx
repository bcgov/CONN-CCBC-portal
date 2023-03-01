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
  analyst: any;
  updateAnalyst: any;
}

const AnalystListRow: React.FC<Props> = ({ analyst, updateAnalyst }) => {
  const { active, familyName, givenName, id } = analyst;
  const analystName = `${givenName} ${familyName}`;

  const [checked, setChecked] = useState(active);

  const handleUpdateAnalyst = (isActive: boolean, analystId) => {
    updateAnalyst({
      variables: {
        input: { id: analystId, analystPatch: { active: isActive } },
      },
      onCompleted: () => {
        setChecked(!active);
      },
      updater: (store, data) => {
        store
          .get(id)
          .setLinkedRecord(store.get(data.updateAnalyst.analyst.id), 'analyst');
      },
    });
  };

  return (
    <tr key={analystName}>
      <StyledTd>{analystName}</StyledTd>
      <StyledTd>
        <StyledContainer>
          <Checkbox
            checked={checked}
            value={checked}
            onChange={() => {
              handleUpdateAnalyst(!active, id);
              setChecked(!checked);
            }}
          />
        </StyledContainer>
      </StyledTd>
    </tr>
  );
};

export default AnalystListRow;
