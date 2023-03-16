import styled from 'styled-components';
import Image from 'next/image';

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

const BCHeader = () => {
  return (
    <StyledFlex>
      <Image
        width={24}
        height={24}
        src="/icons/bcid-favicon-32x32.png"
        alt="bc-gov-logo"
      />
      <span style={{ marginLeft: '8px' }}>BC</span>
    </StyledFlex>
  );
};

export default BCHeader;
