import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import styled from 'styled-components';
import FeatureFlagListRow from './FeatureFlagListRow';
import { StyledHeaderCell } from './FeatureFlagStyledCells';

interface FeatureFlag {
  id: string;
  flagKey: string;
  isEnabled: boolean;
  value: unknown;
  description: string;
}

interface Props {
  featureFlags: FeatureFlag[];
}

const StyledTableContainer = styled(TableContainer)`
  width: 100%;
`;

const FeatureFlagList: React.FC<Props> = ({ featureFlags }) => {
  return (
    <StyledTableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Flag key</StyledHeaderCell>
            <StyledHeaderCell>Enabled</StyledHeaderCell>
            <StyledHeaderCell>Value</StyledHeaderCell>
            <StyledHeaderCell>Description</StyledHeaderCell>
            <StyledHeaderCell>Actions</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {featureFlags?.map((flag) => (
            <FeatureFlagListRow key={flag.id} featureFlag={flag} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default FeatureFlagList;
