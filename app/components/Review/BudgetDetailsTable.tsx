import {
  formatRow,
  StyledTable,
  StyledColError,
  StyledColLeft,
  StyledColRight,
} from './Table';
import formatMoney from '../../utils/formatMoney';

const BudgetDetailsTable = ({ errorSchema, formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);

  return (
    <StyledTable>
      <tbody>
        {rows.map((row) => {
          const title = subschema.properties[row].title;
          const value = formData ? formatRow(formData[row]) : ' ';
          const isRequired = errorSchema.includes(row);

          return (
            <tr key={title}>
              <StyledColLeft>{title}</StyledColLeft>
              {isRequired ? (
                <StyledColError />
              ) : (
                <StyledColRight>{formatMoney(value)}</StyledColRight>
              )}
              <StyledColRight></StyledColRight>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default BudgetDetailsTable;
