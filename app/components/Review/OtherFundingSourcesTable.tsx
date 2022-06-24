import styled from 'styled-components';
import {
  formatRow,
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

const OtherFundingSourcesTable = ({ formData, subschema }: any) => {
  const schema =
    subschema.dependencies.otherFundingSources.oneOf[1].properties
      .otherFundingSourcesArray.items;

  const rows = Object.keys(schema.properties);

  return (
    <StyledTable>
      {formData.map((item: any, i: number) => {
        return (
          <>
            <tr>
              <StyledTitleRow colSpan={2}>
                <StyledH4>{i + 1}. Funding source</StyledH4>
              </StyledTitleRow>
            </tr>
            {rows.map((row, y) => {
              const title = schema.properties[row].title;

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
