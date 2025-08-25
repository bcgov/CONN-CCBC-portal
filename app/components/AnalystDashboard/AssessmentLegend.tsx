import Box from '@mui/material/Box';
import assessmentPillStyles from 'data/assessmentPillStyles';
import styled from 'styled-components';

const StyledLegendBar = styled(Box)`
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  & > strong {
    font-size: 12px;
    align-self: center;
  }
`;

interface StyledLegendPillProps {
  statusStyle: any;
  children?: React.ReactNode;
}

const StyledLegendPill = styled.div<StyledLegendPillProps>`
  display: flex;
  align-items: center;
  font-size: 14px;
  height: fit-content;
  padding: 1px 2px;
  color: ${({ statusStyle }) => statusStyle.primary};
  background-color: ${({ statusStyle }) => statusStyle.backgroundColor};
  border: ${({ statusStyle }) =>
    `solid 1px ${
      statusStyle.backgroundColor !== '#FFFFFF'
        ? statusStyle.backgroundColor
        : '#DDDDDD'
    }`};
  border-radius: 5px;
`;

const AssessmentLegend = () => {
  const legendStatuses = [
    'Not started',
    'Assigned',
    'Needs RFI',
    'Assessment complete',
  ];

  return (
    <StyledLegendBar>
      <strong>Legend:</strong>
      {legendStatuses.map((status) => (
        <StyledLegendPill
          key={`legend-${status}`}
          statusStyle={assessmentPillStyles[status]}
        >
          {status === 'Needs RFI' ? 'Need 2nd Review/Needs RFI' : status}
        </StyledLegendPill>
      ))}
    </StyledLegendBar>
  );
};

export default AssessmentLegend;
