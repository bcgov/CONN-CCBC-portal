import {
  formatRow,
  StyledColError,
  StyledColLeft,
  StyledColRight,
  StyledTable,
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
              <StyledColLeft id={row}>{title}</StyledColLeft>
              {isRequired ? (
                <StyledColError id={`${row}-error`} />
              ) : (
                <StyledColRight id={`${row}-value`}>
                  {formatMoney(value)}
                </StyledColRight>
              )}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default BudgetDetailsTable;
