import {
  formatRow,
  StyledColError,
  StyledColLeft,
  StyledColRight,
  StyledH4,
  StyledTable,
  StyledTitleRow,
} from './Table';

import formatMoney from '../../utils/formatMoney';

const ProjectFundingTable = ({ errorSchema, formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);

  return (
    <StyledTable>
      {rows.map((row) => {
        const title = subschema.properties[row].title;
        const value = formData ? formatRow(formData[row]) : '';
        const isRequired = errorSchema.includes(row);

        return (
          <tbody key={row}>
            {row === 'fundingRequestedCCBC2223' && (
              <tr>
                <StyledTitleRow colSpan={2}>
                  <StyledH4>Amount requested under CCBC</StyledH4>
                </StyledTitleRow>
              </tr>
            )}
            {row === 'applicationContribution2223' && (
              <tr>
                <StyledTitleRow colSpan={2}>
                  <StyledH4>Amount Applicant will contribute</StyledH4>
                </StyledTitleRow>
              </tr>
            )}
            {row === 'infrastructureBankFunding2223' && (
              <tr>
                <StyledTitleRow colSpan={2}>
                  <StyledH4>
                    Amount requested under Canadian Infrastructure Bank
                  </StyledH4>
                </StyledTitleRow>
              </tr>
            )}
            <tr key={row}>
              <StyledColLeft id={row}>{title}</StyledColLeft>
              {isRequired ? (
                <StyledColError id={`${row}-error`} />
              ) : (
                <StyledColRight id={`${row}-value`}>
                  {formatMoney(value)}
                </StyledColRight>
              )}
            </tr>
          </tbody>
        );
      })}
    </StyledTable>
  );
};

export default ProjectFundingTable;
