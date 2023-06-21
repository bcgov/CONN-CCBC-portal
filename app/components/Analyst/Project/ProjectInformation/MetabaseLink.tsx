import styled from 'styled-components';
import MetabaseIcon from './MetabaseIcon';

const StyledFlex = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #d6d6d6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  cursor: pointer;

  svg {
    margin-right: 8px;
  }
`;

interface MetabaseLinkProps { 
  href?: string; 
  text?: string;
  width?: number;
}

const MetabaseLink: React.FC<MetabaseLinkProps> = ({href='', text='', width=326}) => {
  const inlineStyle={width};
  return (
    <StyledFlex href={href} target="_blank" style={inlineStyle}>
      <MetabaseIcon />{text} 
    </StyledFlex>
  );
};

export default MetabaseLink;
