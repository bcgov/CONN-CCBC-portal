import styled from 'styled-components';
import getConfig from 'next/config';
import MetabaseIcon from './MetabaseIcon';

const publicRuntimeConfig = getConfig()?.publicRuntimeConfig;
const namespace = publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;

const isProd = namespace?.endsWith('-prod');

interface StyledFlexProps {
  children?: React.ReactNode;
  'data-testid'?: string;
  href?: string;
  target?: string;
  style?: React.CSSProperties;
}

const StyledFlex = styled.a<StyledFlexProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #d6d6d6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => props.theme.color.links};
  height: fit-content;

  svg {
    margin-right: 8px;
  }
`;

interface MetabaseLinkProps {
  href?: string;
  testHref?: string;
  text?: string;
  width?: number;
}

const MetabaseLink: React.FC<MetabaseLinkProps> = ({
  href = '#',
  text = '',
  width = 326,
  testHref,
}) => {
  const url = isProd ? href : testHref;
  const inlineStyle = { width };
  return (
    <StyledFlex
      data-testid="metabase-link"
      href={url}
      target="_blank"
      style={inlineStyle}
    >
      <MetabaseIcon />
      {text}
    </StyledFlex>
  );
};

export default MetabaseLink;
