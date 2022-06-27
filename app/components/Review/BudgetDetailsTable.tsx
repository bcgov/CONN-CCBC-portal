import { formatRow, StyledTable, StyledColLeft, StyledColRight } from './Table';
import formatMoney from '../../utils/formatMoney';

const BudgetDetailsTable = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);

  return (
    <StyledTable>
      {rows.map((row, i) => {
        const title = subschema.properties[row].title;
        const value = formatRow(formData[row]);

        return (
          <>
            <tr key={i}>
              <StyledColLeft>{title}</StyledColLeft>
              <StyledColRight>{formatMoney(value)}</StyledColRight>
            </tr>
          </>
        );
      })}
    </StyledTable>
  );
};

export default BudgetDetailsTable;
