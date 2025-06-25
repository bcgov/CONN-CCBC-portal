/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-pascal-case */
import { useMemo, useState } from 'react';
import { graphql, useFragment } from 'react-relay';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ColumnSizingState,
} from 'material-react-table';
import { ProjectChangeLog_query$key } from '__generated__/ProjectChangeLog_query.graphql';
import { diff } from 'json-diff';
import { generateRawDiff } from 'components/DiffTable';
import getConfig from 'next/config';
import cbcData from 'formSchema/uiSchema/history/cbcData';
import styled from 'styled-components';
import { Box, Link, TableCellProps } from '@mui/material';
import { DateTime } from 'luxon';
import ClearFilters from 'components/Table/ClearFilters';
import AdditionalFilters from './AdditionalFilters';

interface Props {
  query: any;
}

const StyledTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  margin-left: 2px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledCommunitiesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: none;
`;

const StyledCommunitiesHeader = styled.th`
  width: 50%;
  text-align: left;
  font-weight: bold;
  font-size: 13px;
  height: 32px;
  padding: 4px;
  border-bottom: 1px solid #999;
`;

const ProjectIdCell = ({ cell }) => {
  const applicationId = cell.getValue();
  const isVisibleRow = cell.row.original?.isVisibleRow;
  const rowId = cell.row.original?.id;

  return isVisibleRow ? (
    <StyledLink href={`/analyst/cbc/${rowId}/cbcHistory`}>
      {applicationId}
    </StyledLink>
  ) : null;
};

const MergedCell = ({ cell }) => {
  const value = cell.getValue();
  const isVisibleRow = cell.row.original?.isVisibleRow;

  return isVisibleRow ? value : null;
};

const StyledCommunitiesCell = styled.td<{
  addBorder: boolean;
  isRemoved?: boolean;
}>`
  width: 50%;
  font-size: 13px;
  padding: 2px;
  white-space: nowrap;
  display: table-cell;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 32px;
  border-bottom: ${({ addBorder }) => (addBorder ? '1px solid #ddd' : 'none')};
  text-decoration: ${({ isRemoved }) => (isRemoved ? 'line-through' : 'none')};
`;

const muiTableBodyRowProps = ({ row }) => ({
  id: `${row.original.isCbcProject ? 'cbc' : 'ccbc'}-${row.original.rowId}`,
  hover: false,
  sx: {
    cursor: 'pointer',
    borderTop: row.original.isVisibleRow
      ? '1px solid rgba(224, 224, 224, 1)'
      : 'none',
  },
});

const muiTableBodyCellProps = (): TableCellProps => ({
  align: 'left',
  sx: { padding: '8px', border: 'none', alignItems: 'flex-start' },
});

const muiTableHeadCellProps = {
  sx: {
    wordBreak: 'break-word',
    texOverflow: 'wrap',
    '.Mui-TableHeadCell-Content-Labels': {
      width: '100%',
      justifyContent: 'space-between',
    },
    '.Mui-TableHeadCell-Content-Wrapper ': {
      overflow: 'hidden',
      textOverflow: 'clip',
    },
    '&:last-child': {
      paddingRight: '16px',
    },
  },
};

const formatUser = (item) => {
  const isSystem =
    item.createdBy === 1 &&
    (!item.ccbcUserByCreatedBy || !item.ccbcUserByCreatedBy?.givenName);
  return isSystem
    ? 'The System'
    : `${item.ccbcUserByCreatedBy?.givenName} ${item.ccbcUserByCreatedBy?.familyName}`;
};

const CommunitiesCell = (
  key1: string,
  key2: string,
  value: any[],
  isRemoved: boolean
) => {
  const headers = {
    bc_geographic_name: 'Geographic Name',
    geographic_type: 'Geographic Type',
    economic_region: 'Economic Region',
    regional_district: 'Regional District',
  };
  return (
    <StyledCommunitiesTable>
      <thead>
        <tr>
          <StyledCommunitiesHeader>{headers[key1]}</StyledCommunitiesHeader>
          <StyledCommunitiesHeader>{headers[key2]}</StyledCommunitiesHeader>
        </tr>
      </thead>
      <tbody>
        {value.map((loc, i) => (
          <tr key={loc['communities_source_data_id']}>
            <StyledCommunitiesCell
              addBorder={i < value.length - 1}
              isRemoved={isRemoved}
              title={loc[key1]}
            >
              {loc[key1]}
            </StyledCommunitiesCell>
            <StyledCommunitiesCell
              addBorder={i < value.length - 1}
              isRemoved={isRemoved}
              title={loc[key2]}
            >
              {loc[key2]}
            </StyledCommunitiesCell>
          </tr>
        ))}
      </tbody>
    </StyledCommunitiesTable>
  );
};

const ProjectChangeLog: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment<ProjectChangeLog_query$key>(
    graphql`
      fragment ProjectChangeLog_query on Query {
        allCbcs {
          nodes {
            rowId
            projectNumber
            history {
              nodes {
                op
                createdAt
                createdBy
                id
                record
                oldRecord
                tableName
                ccbcUserByCreatedBy {
                  givenName
                  familyName
                }
              }
            }
          }
        }
        session {
          authRole
        }
      }
    `,
    query
  );

  const enableTimeMachine =
    getConfig()?.publicRuntimeConfig?.ENABLE_MOCK_TIME || false;
  const tableHeightOffset = enableTimeMachine ? '435px' : '360px';
  const filterVariant = 'contains';
  const defaultFilters = [{ id: 'program', value: ['CBC'] }];
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(defaultFilters);
  const { allCbcs } = queryFragment;
  const isLargeUp = useMediaQuery('(min-width:1007px)');

  const tableData = useMemo(() => {
    const entries =
      allCbcs.nodes?.flatMap(
        ({ projectNumber, rowId, history }) =>
          history.nodes.map((item) => {
            const { record, oldRecord, createdAt, op } = item;
            const effectiveDate =
              op === 'UPDATE'
                ? new Date(record?.updated_at)
                : new Date(createdAt);

            const base = {
              changeId: `${projectNumber}-${createdAt}`,
              id: rowId,
              _sortDate: effectiveDate,
              program: 'CBC',
            };

            const json = {
              ...record?.json_data,
              project_number: record?.project_number,
            };
            const prevJson = {
              ...oldRecord?.json_data,
              project_number: oldRecord?.project_number,
            };

            const diffRows = generateRawDiff(
              diff(prevJson, json, { keepUnchangedValues: true }),
              cbcData,
              [
                'id',
                'created_at',
                'updated_at',
                'change_reason',
                'cbc_data_id',
                'locations',
                'errorLog',
                'error_log',
                'projectNumber',
              ],
              'cbcData'
            );

            const meta = {
              createdAt: DateTime.fromJSDate(effectiveDate).toLocaleString(
                DateTime.DATETIME_MED
              ),
              createdBy: formatUser(item),
            };

            const mappedRows = diffRows.map((row, i) => ({
              ...base,
              rowId: projectNumber,
              isVisibleRow: i === 0, // For visual use only
              createdAt: meta.createdAt,
              createdBy: meta.createdBy,
              field: row.field,
              newValue: row.newValue,
              oldValue: row.oldValue,
            }));

            const added = record?.added_communities ?? [];
            const removed = record?.deleted_communities ?? [];

            const hasMappedRows = mappedRows.length > 0;
            const showMetaForRemoved = !hasMappedRows && !added.length;

            const communityRow = (
              label: string,
              values: any[],
              showMeta: boolean
            ) =>
              values.length
                ? [
                    {
                      ...base,
                      rowId: projectNumber,
                      isVisibleRow: showMeta, // For visual use only
                      createdAt: meta.createdAt,
                      createdBy: meta.createdBy,
                      field: label,
                      newValue: values,
                      oldValue: values,
                    },
                  ]
                : [];

            return {
              _sortDate: effectiveDate,
              group: [
                ...mappedRows,
                ...communityRow('Communities Added', added, !hasMappedRows),
                ...communityRow(
                  'Communities Removed',
                  removed,
                  showMetaForRemoved
                ),
              ],
            };
          }) || []
      ) || [];

    return entries
      .sort((a, b) => b._sortDate.getTime() - a._sortDate.getTime())
      .flatMap((entry, i) =>
        entry.group.map((row) => ({
          ...row,
          isEvenGroup: i % 2 === 0,
        }))
      );
  }, [allCbcs]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    return [
      {
        accessorKey: 'rowId',
        id: 'rowId',
        Cell: ProjectIdCell,
        header: 'ID',
        filterFn: filterVariant,
      },
      {
        accessorKey: 'field',
        header: 'Fields changed',
        filterFn: filterVariant,
      },
      {
        accessorKey: 'oldValue',
        header: 'Old Value',
        Cell: ({ row }) => {
          const { field, oldValue } = row.original;

          if (
            (field === 'Communities Added' ||
              field === 'Communities Removed') &&
            Array.isArray(oldValue)
          ) {
            const isRemoved = field === 'Communities Removed';
            return CommunitiesCell(
              'bc_geographic_name',
              'geographic_type',
              oldValue,
              isRemoved
            );
          }

          return oldValue;
        },
        filterFn: filterVariant,
      },
      {
        accessorKey: 'newValue',
        header: 'New Value',
        Cell: ({ row }) => {
          const { field, newValue } = row.original;

          if (
            (field === 'Communities Added' ||
              field === 'Communities Removed') &&
            Array.isArray(newValue)
          ) {
            const isRemoved = field === 'Communities Removed';
            return CommunitiesCell(
              'economic_region',
              'regional_district',
              newValue,
              isRemoved
            );
          }

          return newValue;
        },
        filterFn: filterVariant,
      },
      {
        accessorKey: 'createdBy',
        header: 'User',
        filterFn: filterVariant,
        Cell: MergedCell,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date and Time',
        filterFn: filterVariant,
        Cell: MergedCell,
      },
    ];
  }, [allCbcs]);

  const columnSizing: MRT_ColumnSizingState = {
    rowId: 50,
    createdAt: 104,
    createdBy: 110,
    field: 108,
  };

  const state = {
    showColumnFilters: true,
    columnFilters,
    showGlobalFilter: true,
    columnSizing,
  };

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state,
    muiTableContainerProps: {
      sx: {
        padding: '0 8px 8px 8px',
        maxHeight: `calc(100vh - ${tableHeightOffset})`,
      },
    },
    layoutMode: isLargeUp ? 'grid' : 'semantic',
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    muiTableBodyRowProps,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    rowVirtualizerOptions: { overscan: 50 },
    columnResizeMode: 'onChange',
    enableStickyHeader: true,
    autoResetAll: false,
    enablePagination: false,
    enableGlobalFilter: true,
    globalFilterFn: filterVariant,
    enableBottomToolbar: false,
    onColumnFiltersChange: setColumnFilters,
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <StyledTableHeader>
        <ClearFilters
          table={table}
          filters={table.getState().columnFilters}
          defaultFilters={defaultFilters}
          externalFilters={false}
        />
        <AdditionalFilters
          filters={columnFilters}
          setFilters={setColumnFilters}
          disabledFilters={[{ id: 'program', value: ['CCBC', 'CBC', 'OTHER'] }]}
        />
      </StyledTableHeader>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default ProjectChangeLog;
