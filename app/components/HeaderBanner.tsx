import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import {
  faExclamationTriangle,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getConfig from 'next/config';
import styled from 'styled-components';

interface StyledHeaderBannerProps {
  type: 'success' | 'warn' | 'error';
}

const StyledBaseHeaderBanner = styled(BaseHeader)<StyledHeaderBannerProps>`
  color: ${(props) => props.theme.color.white};
  font-size: 11px;
  font-weight: bold;
  padding-left: 30px;
  background-color: ${(props) => {
    if (props.type === 'error') {
      return props.theme.color.error;
    }
    if (props.type === 'warn') {
      return props.theme.color.warnBackground;
    }
    if (props.type === 'success') {
      return props.theme.color.success;
    }
    return props.theme.color.backgroundMagenta;
  }};
`;

const StyledDiv = styled('div')`
  width: 100%;
  max-width: ${(props) => props.theme.width.pageMaxWidth};
  margin: auto;
`;

interface Props {
  message: string;
  type: 'success' | 'warn' | 'error';
  environmentIndicator: boolean;
}

const HeaderBanner: React.FC<Props> = ({
  message,
  type,
  environmentIndicator,
}) => {
  const publicRuntimeConfig = getConfig()?.publicRuntimeConfig;
  const namespace = publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  const isTest = namespace?.endsWith('-test');
  return (
    <>
      {environmentIndicator && (
        <StyledBaseHeaderBanner header="sub">
          <StyledDiv>
            Connected Communities BC portal{' '}
            {isTest ? ' Test ' : ' Development '} environment.
          </StyledDiv>
        </StyledBaseHeaderBanner>
      )}
      {message && (
        <StyledBaseHeaderBanner header="sub" type={type}>
          <StyledDiv>
            <FontAwesomeIcon
              data-testid="header-banner-icon"
              size="1x"
              icon={type === 'success' ? faSquareCheck : faExclamationTriangle}
            />
            {'  '}
            {message}
          </StyledDiv>
        </StyledBaseHeaderBanner>
      )}
    </>
  );
};

export default HeaderBanner;
