import React from 'react';
import styled from 'styled-components';

const StyledTable = styled('table')`
  font-family: 'Roboto';
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
`;

const StyledColLeft = styled('td')`
  // Todo: workaround for Jest styled component theme prop error
  // background-color: ${(props) => props.theme.color.backgroundGrey};
  background-color: '#F2F2F2';
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-left: 0;
  font-weight: 400;
  white-space: pre-line;
  vertical-align: top;
`;

const StyledColRight = styled('td')`
  width: 50%;
  padding: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-right: 0;
  font-weight: 400;
  white-space: pre-line;
`;

const StyledTitleRow = styled('td')`
  padding: 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
`;

const StyledH4 = styled('h4')`
  margin: 0;
`;

const formatRow = (row: any) => {
  if (typeof row === 'string' || row instanceof String) {
    return row;
  } else if (Array.isArray(row)) {
    return (row = row.join('\r,\n'));
  } else if (row === true) {
    return 'Yes';
  } else if (row === false) {
    return 'No';
  } else {
    return row;
  }
};

const Table = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);

  return (
    <StyledTable>
      <tbody>
        {rows.map((row) => {
          const title = subschema.properties[row].title;
          const isObject = subschema.properties[row].type === 'object';
          const value = formData ? formatRow(formData[row]) : ' ';

          return (
            <React.Fragment key={row}>
              {isObject ? (
                <tr>
                  <StyledTitleRow colSpan={2}>
                    <StyledH4>{title}</StyledH4>
                  </StyledTitleRow>
                </tr>
              ) : (
                <tr>
                  <StyledColLeft>{title}</StyledColLeft>
                  <StyledColRight>{value}</StyledColRight>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default Table;

export {
  formatRow,
  StyledTable,
  StyledColLeft,
  StyledColRight,
  StyledTitleRow,
  StyledH4,
};
