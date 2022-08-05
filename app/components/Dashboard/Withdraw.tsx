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

const StyledDropdown = styled('div')`
  position: relative;
  display: inline-block;

  &:hover .dropdown-content {
    display: block;
  }
`;

const StyledContent = styled('div')`
  display: none;
  position: absolute;
  background: #ffffff;
  border: 1px solid #939393;
  border-radius: 2px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 0;

  & a {
    color: #d8292f;
  }
`;

const StyledIcon = styled('span')`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: #eaeaea;
`;

const Withdraw = () => {
  return (
    <StyledWithdraw>
      <div>
        <Divider />
      </div>
      <StyledDropdown>
        <StyledIcon>
          <ArrowDown />
        </StyledIcon>
        <StyledContent className="dropdown-content">
          <a href="#modal-id">Withdraw</a>
        </StyledContent>
      </StyledDropdown>
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

const ArrowDown = () => {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L7 7L13 1" stroke="#1A5A96" />
    </svg>
  );
};
