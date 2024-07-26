import React from 'react';
import { Dropdown, Button } from '@button-inc/bcgov-theme';
import styled from 'styled-components';
import TablePagination from '@mui/material/TablePagination';

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

const paginationComponents = {
  select: Dropdown,
  toolbar: styled.div`
    display: flex;
    font-size: 0.8rem;
    justify-content: flex-end;
    align-items: baseline;
    & > * {
      margin-right: 0.5rem;
    }
  `,
};

const actionButtonProps = {
  variant: 'secondary',
  size: 'small',
  style: {
    padding: '0.33rem 0.50rem',
    marginRight: '0.2rem',
  },
};

const paginationComponentsProps = {
  actions: {
    components: {
      FirstButton: Button,
      LastButton: Button,
      NextButton: Button,
      BackButton: Button,
    },
    componentsProps: {
      firstButton: actionButtonProps,
      lastButton: actionButtonProps,
      nextButton: actionButtonProps,
      backButton: actionButtonProps,
    },
    showFirstButton: true,
    showLastButton: true,
  },
  select: {
    size: 'small',
    style: { width: '3.5rem' },
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
        component="div"
        count={totalCount}
        page={activePage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        labelRowsPerPage="Items per page:"
        slots={paginationComponents as any}
        slotProps={paginationComponentsProps as any}
      />
    </td>
  );
};

export default FilterableTablePagination;
