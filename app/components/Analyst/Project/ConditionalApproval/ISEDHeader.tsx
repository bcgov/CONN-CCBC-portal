import styled from 'styled-components';

const StyledFlex = styled.div`
  display: flex;
  align-items: center;
  color: #9b9b9b;
  font-size: 16px;
  margin: 0;

  & svg {
    margin-right: 8px;
  }
`;

const ISEDHeader = () => {
  return (
    <StyledFlex>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="-2015 -2000 4030 4030"
      >
        <path
          fill="#f00"
          d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
        />
      </svg>
      <span>ISED</span>
    </StyledFlex>
  );
};

export default ISEDHeader;
