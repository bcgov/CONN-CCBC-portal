import { Button } from '@mui/material';
import {
  MRT_ColumnFiltersState,
  MRT_TableInstance,
} from 'material-react-table';

interface Props {
  table: MRT_TableInstance<any>;
  filters: MRT_ColumnFiltersState;
  defaultFilters?: MRT_ColumnFiltersState;
}

const ClearFilters: React.FC<Props> = ({
  table,
  filters,
  defaultFilters = [],
}) => {
  // Clear all filters except program
  const clearFilters = () => {
    table.resetColumnFilters();
    table.setColumnFilters(defaultFilters);
    table.setGlobalFilter('');
  };

  const isTableFiltersPresent =
    filters.filter((f) => f.id !== 'program' && (f.value as any[]).length > 0)
      .length > 0;

  const isExternalFiltersPresent =
    filters.filter((f) => f.id === 'program' && (f.value as any[]).length < 3)
      .length > 0;

  const isGlobalFilterPresent =
    table.getState().globalFilter && table.getState().globalFilter !== '';

  return (
    <Button
      disabled={
        !isTableFiltersPresent &&
        !isExternalFiltersPresent &&
        !isGlobalFilterPresent
      }
      variant="text"
      onClick={clearFilters}
      data-testid="clear-filter-button"
      sx={{
        padding: 0,
        justifyContent: 'flex-start',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        textTransform: 'none',
      }}
    >
      Clear Filtering
    </Button>
  );
};

export default ClearFilters;
