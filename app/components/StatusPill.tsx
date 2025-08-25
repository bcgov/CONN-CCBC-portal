import React from 'react';
import styled from 'styled-components';

interface Props {
  status: string;
  styles: any;
}

interface StatusPillProps {
  children?: React.ReactNode;
  styles: {
    border?: string;
    primary: string;
    backgroundColor: string;
    pillWidth?: string;
    description: string;
  };
}

const StyledStatusPill = styled.div<StatusPillProps>`
  color: ${(props) => props.styles?.primary};
  background-color: ${(props) => props.styles?.backgroundColor};
  border: ${(props) => props.styles?.border || 'none'};
  border-radius: 30px;
  padding: 4px 12px;
  max-width: 212px;
  text-align: center;
  width: fit-content;
  overflow-wrap: break-word;
`;

const StatusPill: React.FC<Props> = ({ status, styles }) => {
  const pillStyles = styles[status];

  return (
    <StyledStatusPill
      styles={pillStyles}
      data-testid="status-pill"
      aria-labelledby="status-pill"
    >
      {pillStyles?.description || status}
    </StyledStatusPill>
  );
};

export default StatusPill;
