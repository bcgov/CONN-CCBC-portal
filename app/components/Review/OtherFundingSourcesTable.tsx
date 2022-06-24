import styled from 'styled-components';
import {
  StyledTable,
  StyledColLeft,
  StyledColRight,
  StyledTitleRow,
  StyledH4,
} from './Table';

const StyledSubtitle = styled('h6')`
  padding: 16px !important;
  border-left: 0;
  font-weight: 600;
  margin: 0;
`;

const formatRow = (row: any) => {
  if (typeof row === 'string' || row instanceof String) {
    return row;
  } else if (row === true) {
    return 'true';
  } else if (row === false) {
    return 'false';
  } else {
    return '';
  }
};

const OtherFundingSourcesTable = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);
  return (
    <StyledTable>
      {formData.map((item: any, i: number) => {
        return (
          <>
            <tr>
              <StyledTitleRow>
                <StyledH4>{i + 1}. Funding source</StyledH4>
              </StyledTitleRow>
            </tr>
            {rows.map((row, y) => {
              const title = subschema.properties[row].title;
              const value = formatRow(item[row]);
              return (
                <>
                  {y === 5 && (
                    <tr>
                      <StyledSubtitle>
                        Amount requested under source:
                      </StyledSubtitle>
                    </tr>
                  )}
                  <tr key={y}>
                    <StyledColLeft>{title}</StyledColLeft>
                    <StyledColRight>{value}</StyledColRight>
                  </tr>
                </>
              );
            })}
          </>
        );
      })}
    </StyledTable>
  );
};

export default OtherFundingSourcesTable;
