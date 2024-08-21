import React from 'react';
import { IconButtonProps, TablePagination } from '@mui/material';

interface Props {
  /**
   * The total number of items in all of the pages
   */
  totalCount: number;
  /**
   * Defaults to DEFAULT_PAGE_SIZE.
   */
  pageSize?: number;
  /**
   * The number of items to skip to get to the current page. Defaults to 0
   */
  offset?: number;
  disabled;
  onOffsetChange: (offset: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const DEFAULT_PAGE_SIZE = 20;

const PAGE_SIZE_OPTIONS = [20, 50, 100];

const actionButtonProps: IconButtonProps = {
  size: 'small',
  style: {
    padding: '0.33rem 0.50rem',
    marginRight: '0.2rem',
  },
};

const FilterableTablePagination: React.FunctionComponent<Props> = ({
  totalCount,
  pageSize = DEFAULT_PAGE_SIZE,
  offset = 0,
  disabled,
  onOffsetChange,
  onPageSizeChange,
}) => {
  const activePage = Math.floor(offset / pageSize) || 0;

  const handlePageChange = (_event, pageNumber: number) => {
    onOffsetChange(pageNumber * pageSize);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <td
      colSpan={1000}
      aria-disabled={disabled}
      className={disabled ? 'disabled' : ''}
    >
      <TablePagination
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        colSpan={3}
        count={totalCount}
        rowsPerPage={pageSize}
        page={activePage}
        labelRowsPerPage="Items per page:"
        showFirstButton
        showLastButton
        slotProps={{
          select: {
            size: 'small',
            style: { width: '3.5rem' },
          },
          actions: {
            firstButton: actionButtonProps,
            lastButton: actionButtonProps,
            nextButton: actionButtonProps,
            previousButton: actionButtonProps,
          },
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </td>
  );
};

export default FilterableTablePagination;
