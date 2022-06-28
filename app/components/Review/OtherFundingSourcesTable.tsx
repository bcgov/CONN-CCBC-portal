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
  font-size: 14px;
`;

const StyledTd = styled('td')`
  padding: 0;
`;

import formatMoney from '../../utils/formatMoney';
import React from 'react';

const OtherFundingSourcesTable = ({ formData, subschema }: any) => {
  const arraySchema =
    subschema.dependencies.otherFundingSources.oneOf[1].properties
      .otherFundingSourcesArray.items;
  const arrayFormData = formData?.otherFundingSourcesArray;

  const otherFundingSourcesTitle =
    subschema.properties.otherFundingSources.title;
  const otherFundingSourcesValue = formData?.otherFundingSources;

  const rows = Object.keys(arraySchema.properties);

  const moneyFields = [
    'requestedFundingPartner2223',
    'requestedFundingPartner2324',
    'requestedFundingPartner2425',
    'requestedFundingPartner2526',
    'requestedFundingPartner2627',
    'totalRequestedFundingPartner',
  ];

  return (
    <StyledTable>
      <tbody>
        {!arrayFormData ? (
          <tr>
            <StyledColLeft>{otherFundingSourcesTitle}</StyledColLeft>
            <StyledColRight>{otherFundingSourcesValue}</StyledColRight>
          </tr>
        ) : (
          arrayFormData &&
          arrayFormData.map((item: any, i: number) => {
            return (
              <React.Fragment key={i}>
                <tr>
                  <StyledTitleRow colSpan={2}>
                    <StyledH4>{i + 1}. Funding source</StyledH4>
                  </StyledTitleRow>
                </tr>

                {rows.map((row, y) => {
                  const title = arraySchema.properties[row]?.title;
                  const value = formatRow(item[row]);
                  const isMoneyField = moneyFields.includes(row);

                  return (
                    <React.Fragment key={row}>
                      {y === 5 && (
                        <tr>
                          <StyledTd>
                            <StyledSubtitle>
                              Amount requested under source:
                            </StyledSubtitle>
                          </StyledTd>
                        </tr>
                      )}
                      <tr>
                        <StyledColLeft>{title}</StyledColLeft>
                        <StyledColRight>
                          {isMoneyField ? formatMoney(value) : value}
                        </StyledColRight>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    </StyledTable>
  );
};

export default OtherFundingSourcesTable;
