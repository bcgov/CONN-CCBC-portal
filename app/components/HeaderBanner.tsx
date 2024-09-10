import { BaseHeader } from '@button-inc/bcgov-theme/Header';
import {
  faExclamationTriangle,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getConfig from 'next/config';
import styled from 'styled-components';

interface StyledHeaderBannerProps {
  type?: 'success' | 'warn' | 'error' | 'custom';
}

const StyledBaseHeaderBanner = styled(BaseHeader)<StyledHeaderBannerProps>`
  color: ${(props) =>
    props.type === 'custom' ? props.customFontColor : props.theme.color.white};
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
    if (props.type === 'custom') {
      return props.customBannerColor;
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
  type: 'success' | 'warn' | 'error' | 'custom';
  environmentIndicator: boolean;
  customBannerColor?: string;
  customFontColor?: string;
}

const HeaderBanner: React.FC<Props> = ({
  message,
  type,
  environmentIndicator,
  customBannerColor,
  customFontColor,
}) => {
  const publicRuntimeConfig = getConfig()?.publicRuntimeConfig;
  const namespace = publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  const isTest = namespace?.endsWith('-test');
  const isProd = namespace?.endsWith('-prod');
  return (
    <>
      {/* Shows the environment banner only in test and dev */}
      {environmentIndicator && !isProd && (
        <StyledBaseHeaderBanner header="sub">
          <StyledDiv>
            Connecting Communities BC portal{' '}
            {isTest ? ' Test ' : ' Development '} environment.
          </StyledDiv>
        </StyledBaseHeaderBanner>
      )}
      {message && (
        <StyledBaseHeaderBanner
          header="sub"
          type={type}
          customBannerColor={customBannerColor}
          customFontColor={customFontColor}
        >
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
