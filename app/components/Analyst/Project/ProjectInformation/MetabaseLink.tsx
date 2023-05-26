import styled from 'styled-components';
import MetabaseIcon from './MetabaseIcon';

const StyledFlex = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  width: 306px;
  border: 1px solid #d6d6d6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  svg {
    margin-right: 8px;
  }
`;

const MetabaseLink = () => {
  return (
    <StyledFlex href="" target="_blank">
      <MetabaseIcon /> View in Metabase
    </StyledFlex>
  );
};

export default MetabaseLink;
