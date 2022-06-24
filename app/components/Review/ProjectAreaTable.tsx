import { formatRow, StyledTable, StyledColLeft, StyledColRight } from './Table';

const ProjectAreaTable = ({ formData, subschema }: any) => {
  const rows = Object.keys(subschema.properties);
  const multipleAreas = formData?.projectSpanMultipleLocations === 'Yes';
  const multipleAreasSchema =
    subschema.dependencies.projectSpanMultipleLocations.oneOf[1].properties
      .provincesTerritories;
  return (
    <StyledTable>
      {rows.map((row, i) => {
        const title = subschema.properties[row].title;
        const value = formatRow(formData[row]);

        return (
          <tr key={title}>
            <StyledColLeft>{title}</StyledColLeft>
            <StyledColRight>{value}</StyledColRight>
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
    </StyledTable>
  );
};

export default ProjectAreaTable;
