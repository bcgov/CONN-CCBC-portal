import styled from 'styled-components';

const StyledWithdraw = styled('div')`
  display: flex;
  flex-direction: row;
  div:first-child {
    margin: 0 8px;
    display: flex;
    align-items: center;
  }
`;

const Withdraw = () => {
  return (
    <StyledWithdraw>
      <div>
        <Divider />
      </div>
      <a href="#modal-id">Withdraw</a>
    </StyledWithdraw>
  );
};
export default Withdraw;

const Divider = () => {
  return (
    <svg
      width="2"
      height="17"
      viewBox="0 0 2 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 0.5V16.5" stroke="#D6D6D6" />
    </svg>
  );
};
