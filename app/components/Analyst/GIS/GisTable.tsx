import { JSONSchema7 } from 'json-schema';
import { useMemo } from 'react';
import gisSchema from '../../../backend/lib/gis-schema.json';

export function getKeysFromSchema(jsonSchema: JSONSchema7) {
  const items = jsonSchema.items as JSONSchema7;
  return Object.keys(items.properties);
}
// would be nice if we could get an interface out of a jsonschema7 object
interface GisTableProps {
  data: Array<any>;
  numPreview: number;
}

const GisTable: React.FunctionComponent<GisTableProps> = ({
  data,
  numPreview,
}) => {
  const columns = useMemo(() => {
    return getKeysFromSchema(gisSchema as JSONSchema7);
  }, []);
  return (
    <table>
      <thead>
        {columns.map((cellHeader) => (
          <th key={cellHeader}>{cellHeader}</th>
        ))}
      </thead>
      <tbody>
        {data.slice(0, numPreview).map((row) => {
          return (
            <tr key={row.ccbc_id}>
              {columns.map((column) => {
                return <td key={`${row.ccbc_id}_${column}`}>{row[column]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default GisTable;
