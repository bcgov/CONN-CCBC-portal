import { useMemo } from 'react';
import styled from 'styled-components';
import { RJSFSchema } from '@rjsf/utils';
import gisSchema from '../../../backend/lib/gis-schema.json';

const Table = styled.table`
  border-collapse: collapse;
`;

interface TableRowProps {
  children?: React.ReactNode;
}

const TableRow = styled.tr<TableRowProps>`
  border: 1px solid #d6d6d6;
`;

interface TableCellProps {
  children?: React.ReactNode;
}

const TableCell = styled.td<TableCellProps>`
  border: 1px solid #d6d6d6;

  &:first-child {
    padding-left: ${(props) => props.theme.spacing.small};
  }
  &:last-child {
    padding-right: ${(props) => props.theme.spacing.small};
  }
`;

interface TableHeaderProps {
  children?: React.ReactNode;
}

const TableHeader = styled.th<TableHeaderProps>`
  border: 1px solid #d6d6d6;

  &:first-child {
    padding-left: ${(props) => props.theme.spacing.small};
  }

  &:last-child {
    padding-right: ${(props) => props.theme.spacing.small};
  }
`;

export function getKeysFromSchema(jsonSchema: RJSFSchema) {
  const items = jsonSchema.items as RJSFSchema;
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
    return getKeysFromSchema(gisSchema as RJSFSchema);
  }, []);
  return (
    <Table>
      <thead>
        {columns.map((cellHeader) => (
          <TableHeader key={cellHeader}>{cellHeader}</TableHeader>
        ))}
      </thead>
      <tbody>
        {data.slice(0, numPreview).map((row) => {
          return (
            <TableRow key={row.ccbc_id}>
              {columns.map((column) => {
                return (
                  <TableCell key={`${row.ccbc_id}_${column}`}>
                    {row[column]}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
};

export default GisTable;
