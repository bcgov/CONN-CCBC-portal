import { Button } from '@mui/material';
import {
  MRT_ColumnFiltersState,
  MRT_TableInstance,
} from 'material-react-table';

interface Props {
  table: MRT_TableInstance<any>;
  filters: MRT_ColumnFiltersState;
}

const ClearFilters: React.FC<Props> = ({ table, filters }) => {
  const clearFilters = () => table.resetColumnFilters();

  return (
    <Button
      disabled={filters.length < 1}
      variant="text"
      onClick={clearFilters}
      data-testid="clear-filter-button"
      sx={{
        padding: 0,
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
