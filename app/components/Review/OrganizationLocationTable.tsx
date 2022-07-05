import styled from 'styled-components';
import {
  formatRow,
  StyledColError,
  StyledColLeft,
  StyledColRight,
  StyledTable,
} from './Table';

const StyledSubtitle = styled('h6')`
  padding: 16px !important;
  border-left: 0;
  font-weight: 600;
  margin: 0;
`;

const StyledTd = styled('td')`
  padding: 0;
`;

const OrganizationLocationTable = ({
  errorSchema,
  formData,
  subschema,
}: any) => {
  const rows = Object.keys(subschema.properties);

  const arraySchema =
    subschema.dependencies.isMailingAddress.oneOf[1].properties.mailingAddress
      .properties;
  const arrayFormData = formData?.mailingAddress;
  const mailingAddressRows = Object.keys(arraySchema);

  return (
    <StyledTable>
      <tbody>
        {rows.map((row) => {
          const isRequired = errorSchema.includes(row);

          const title = subschema.properties[row]?.title;
          const value = formData ? formatRow(formData[row]) : ' ';

          return (
            <tr key={row}>
              <StyledColLeft>{title}</StyledColLeft>
              {isRequired ? (
                <StyledColError />
              ) : (
                <StyledColRight>{value}</StyledColRight>
              )}
            </tr>
          );
        })}
        {arrayFormData && (
          <tr>
            <StyledTd colSpan={2}>
              <StyledSubtitle>Mailing address:</StyledSubtitle>
            </StyledTd>
          </tr>
        )}
        {arrayFormData &&
          mailingAddressRows.map((row) => {
            const title = arraySchema[row]?.title;
            const value = arrayFormData ? arrayFormData[row] : '';
            return (
              <tr key={row}>
                <StyledColLeft>{title}</StyledColLeft>
                <StyledColRight>{value}</StyledColRight>
              </tr>
            );
          })}
      </tbody>
    </StyledTable>
  );
};

export default OrganizationLocationTable;
