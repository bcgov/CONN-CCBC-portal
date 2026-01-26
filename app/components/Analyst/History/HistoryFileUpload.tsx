import { DateTime } from 'luxon';
import {
  DropdownOption,
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo } from 'react';
import { TableCellProps } from '@mui/material';
import styled from 'styled-components';
import { filterOutNullishs } from 'components/AnalystDashboard/AllDashboard';
import ClearFilters from 'components/Table/ClearFilters';
import reportClientError from 'lib/helpers/reportClientError';
import DateFilter from '../../Table/Filters/DateFilter';

const StyledLink = styled.button`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  word-break: break-word;
`;

const handleDownload = async (uuid, fileName) => {
  const encodedFileName = encodeURIComponent(fileName);
  const url = `/api/s3/download/${uuid}/${encodedFileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      window.open(response, '_blank');
    });
};

const downloadJsonFile = (fileName: string, data: any) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const fileCell = ({ cell }) => {
  return (
    <StyledLink
      data-testid="history-file-link"
      onClick={(e) => {
        e.preventDefault();
        if (cell.row.original?.uuid) {
          handleDownload(cell.row.original?.uuid, cell.getValue()).catch(
            (err) => {
              reportClientError(err, { source: 'history-file-download' });
            }
          );
        } else if (cell.row.original?.record) {
          downloadJsonFile(cell.getValue(), cell.row.original?.record);
        }
      }}
    >
      {cell.getValue()}
    </StyledLink>
  );
};

const dateUploadedCell = ({ cell }) => {
  return DateTime.fromISO(cell.row.original.createdAt)
    .setZone('America/Los_Angeles')
    .toLocaleString(DateTime.DATETIME_FULL);
};

const HistoryFileUpload = ({ historyTableList }) => {
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const uniqueUsers = [
      ...new Set(historyTableList.map((historyItem) => historyItem.name)),
    ].filter(filterOutNullishs);

    return [
      {
        accessorKey: 'name',
        header: 'Uploaded by',
        size: 300,
        filterVariant: 'select',
        filterSelectOptions: (uniqueUsers as DropdownOption[]) || [],
      },
      {
        accessorKey: 'file',
        header: 'File',
        size: 450,
        Cell: fileCell,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date uploaded',
        Cell: dateUploadedCell,
        size: 300,
        filterVariant: 'date',
        Filter: DateFilter,
        sortingFn: 'datetime',
        filterFn: (row, _columnIds, filterValue) => {
          if (!filterValue) return true;
          const rowDate = DateTime.fromISO(row.original.createdAt).toFormat(
            'yyyy-MM-dd'
          );
          return rowDate === filterValue;
        },
      },
    ];
  }, [historyTableList]);

  const muiTableBodyCellProps = (): TableCellProps => {
    return {
      sx: {
        padding: '8px !important',
      },
    };
  };

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
        padding: '0',
      },
      '&:last-child': {
        paddingRight: '16px',
      },
      '&:first-child': {
        paddingLeft: '16px',
      },
    },
  };

  const table = useMaterialReactTable({
    columns,
    data: historyTableList,
    enablePagination: false,
    enableBottomToolbar: false,
    enableGlobalFilter: false,
    muiTableContainerProps: {
      sx: {
        padding: '0 8px 8px 8px',
        maxHeight: '100%',
      },
    },
    muiTableBodyRowProps: {
      sx: {
        boxShadow: '0 3px 3px -2px #c4c4c4',
      },
    },
    muiTableBodyCellProps,
    muiTableHeadCellProps,
    renderTopToolbarCustomActions: () => (
      <ClearFilters table={table} filters={table.getState().columnFilters} />
    ),
  });
  return (
    <>
      <h2>Upload History</h2>
      <MaterialReactTable table={table} />
    </>
  );
};

export default HistoryFileUpload;
