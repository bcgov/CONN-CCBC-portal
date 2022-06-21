import styled from 'styled-components';

const StyledTable = styled('table')`
  font-family: 'Roboto';
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
`;

const StyledColLeft = styled('th')`
  background-color: ${(props) => props.theme.color.backgroundGrey};
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  font-weight: 400;
  white-space: pre-line;
`;

const StyledColRight = styled('th')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
`;

const Table = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);
  return (
    <StyledTable>
      {rows.map((row, i) => {
        const title = subschema.properties[row].title;

        const formatRow = (row: any) => {
          if (typeof row === 'string' || row instanceof String) {
            return row;
          } else if (row === true) {
            return 'true';
          } else if (row === false) {
            return 'false';
          }
        };
        const value = formatRow(formData[row]);
        return (
          <tr key={i}>
            <StyledColLeft>{title}</StyledColLeft>
            <StyledColRight>{value}</StyledColRight>
          </tr>
        );
      })}
    </StyledTable>
  );
};

export default Table;
