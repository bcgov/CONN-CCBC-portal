import { errors } from 'openid-client';
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
          console.log(row);
          const title = subschema.properties[row].title;
          const value = formData ? formatRow(formData[row]) : ' ';
          const isRequired = errorSchema.includes(row);

          return (
            <tr key={title}>
              <StyledColLeft id={row}>{title}</StyledColLeft>
              {isRequired && row === 'geographicArea' ? (
                <StyledColError id={`${row}-error`} />
              ) : (
                <StyledColRight id={`${row}-value`}>{value}</StyledColRight>
              )}
            </tr>
          );
        })}
        {multipleAreas && (
          <tr>
            <StyledColLeft id="provincesTerritories">
              {multipleAreasSchema.title}
            </StyledColLeft>
            <StyledColRight id="provincesTerritories-value">
              {formatRow(formData?.provincesTerritories || '')}
            </StyledColRight>
          </tr>
        )}
      </tbody>
    </StyledTable>
  );
};

export default ProjectAreaTable;
