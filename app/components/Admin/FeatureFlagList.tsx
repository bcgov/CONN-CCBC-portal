import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
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
  relayConnectionId: string;
}

const FeatureFlagList: React.FC<Props> = ({
  featureFlags,
  relayConnectionId,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ width: '100%' }}>
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
            <FeatureFlagListRow
              key={flag.id}
              featureFlag={flag}
              relayConnectionId={relayConnectionId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeatureFlagList;
