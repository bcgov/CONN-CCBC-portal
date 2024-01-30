import { Button } from '@mui/material';
import {
  MRT_ColumnFiltersState,
  MRT_TableInstance,
} from 'material-react-table';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  padding: 8px 0 0 0;
  margin-top: 1;
  &:hover {
    background-color: transparent;
  }
  text-transform: none;
`;

interface Props {
  table: MRT_TableInstance<any>;
  filters: MRT_ColumnFiltersState;
}

const ClearFilters: React.FC<Props> = ({ table, filters }) => {
  const clearFilters = () => table.resetColumnFilters();

  return (
    <StyledButton
      disabled={filters.length < 1}
      variant="text"
      onClick={clearFilters}
      data-testid="clear-filter-button"
    >
      Clear Filtering
    </StyledButton>
  );
};

export default ClearFilters;
