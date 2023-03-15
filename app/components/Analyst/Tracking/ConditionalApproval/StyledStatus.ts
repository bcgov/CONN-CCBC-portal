import styled from 'styled-components';

interface StatusProps {
  statusType: string;
}
const StyledStatus = styled.div<StatusProps>`
  border-radius: 4px;
  padding: 4px 16px;
  color: ${(props) => props.theme.color.white};
  background-color: ${(props) =>
    props.statusType === 'Conditionally Approved'
      ? props.theme.color.success
      : props.theme.color.primaryBlue};
  width: fit-content;
`;

export default StyledStatus;
