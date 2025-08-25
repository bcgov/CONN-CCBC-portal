import styled from 'styled-components';

interface StatusProps {
  children?: React.ReactNode;
  statusType: string;
  'data-testid'?: string;
}
const StyledStatus = styled.div<StatusProps>`
  border-radius: 30px;
  padding: 4px 16px;
  color: ${(props) => props.theme.color.white};
  background-color: ${(props) =>
    props.statusType === 'Conditionally Approved'
      ? props.theme.color.success
      : props.theme.color.primaryBlue};
  width: fit-content;
  cursor: default;
`;

export default StyledStatus;
