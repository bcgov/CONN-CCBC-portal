import { Chip, TableCell } from '@mui/material';
import styled from 'styled-components';

export const StyledCell = styled(TableCell)`
  && {
    padding: 12px 24px;
  }
`;

export const StyledHeaderCell = styled(StyledCell)`
  font-weight: 700;
  background: ${(props) => props.theme.color.backgroundGrey};
`;

export const StyledValueCell = styled(StyledCell)`
  font-family: monospace;
  font-size: 0.85rem;
`;

export const StatusChip = styled(Chip)<{ $isEnabled: boolean }>`
  && {
    background-color: ${(props) =>
      props.$isEnabled ? '#DFF0D8' : props.theme.color.errorBackground};
    color: ${(props) =>
      props.$isEnabled ? props.theme.color.success : props.theme.color.error};
    font-weight: 600;
  }
`;
