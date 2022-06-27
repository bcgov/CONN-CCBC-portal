import { formatRow, StyledTable, StyledColLeft, StyledColRight } from './Table';
import formatMoney from '../../utils/formatMoney';

const BudgetDetailsTable = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);

  return (
    <StyledTable>
      <tbody>
        {rows.map((row) => {
          const title = subschema.properties[row].title;
          const value = formData ? formatRow(formData[row]) : ' ';

          return (
            <tr key={title}>
              <StyledColLeft>{title}</StyledColLeft>
              <StyledColRight>{formatMoney(value)}</StyledColRight>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default BudgetDetailsTable;
