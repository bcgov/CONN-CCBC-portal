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
  // Clear all filters except projectType
  const clearFilters = () => {
    table.resetColumnFilters();
    table.setColumnFilters(defaultFilters);
  };

  const isTableFiltersPresent =
    filters.filter(
      (f) => f.id !== 'projectType' && (f.value as any[]).length > 0
    ).length > 0;

  const isExternalFiltersPresent =
    filters.filter(
      (f) => f.id === 'projectType' && (f.value as any[]).length < 3
    ).length > 0;

  return (
    <Button
      disabled={!isTableFiltersPresent && !isExternalFiltersPresent}
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
