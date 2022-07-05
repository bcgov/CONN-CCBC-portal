import {
  formatRow,
  StyledColError,
  StyledColLeft,
  StyledColRight,
  StyledTable,
} from './Table';

const ProjectAreaTable = ({ errorSchema, formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);
  const multipleAreas = formData?.projectSpanMultipleLocations === 'Yes';
  const multipleAreasSchema =
    subschema.dependencies.projectSpanMultipleLocations.oneOf[1].properties
      .provincesTerritories;
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
                <StyledColRight>{value}</StyledColRight>
              )}
            </tr>
          );
        })}
        {multipleAreas && (
          <tr>
            <StyledColLeft>{multipleAreasSchema.title}</StyledColLeft>
            <StyledColRight>
              {formatRow(formData?.provincesTerritories || '')}
            </StyledColRight>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );
};

export default ProjectAreaTable;
