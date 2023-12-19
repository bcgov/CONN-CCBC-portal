import { WidgetProps } from '@rjsf/core';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';
import { ZONE_MAP_URL } from 'data/externalConstants';
import { Toast } from 'components';
import { useState } from 'react';

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  margin-left: 0.5%;
  :hover {
    cursor: pointer;
  }
`;

const StyledImage = styled.img`
  margin-bottom: 0px;
  width: 100%;
  height: auto;
`;

const StyledDiv = styled.div`
  margin-bottom: 3%;
`;

const StyledExternalLink = styled.a`
  color: ${(props) => props.theme.color.white};
  text-decoration-line: underline;
  :hover {
    cursor: pointer;
  }
`;

const ZoneMapWidget: React.FC<WidgetProps> = ({ formContext }) => {
  const [showToast, setShowToast] = useState(false);

  const formData = formContext?.fullFormData || {};
  const updatedMap = formData?.projectArea?.firstNationsLed
    ? '/images/zone-map.png'
    : '/images/zone-map-intake-3.png';

  const handleDownload = (e: any) => {
    e.preventDefault();
    setShowToast(false);
    fetch(ZONE_MAP_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'internet-zones.kmz';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        setShowToast(true);
        Sentry.captureException(error);
      });
  };

  return (
    <StyledDiv>
      <StyledImage
        src={updatedMap}
        alt="Internet Blocking Map"
        width={0}
        height={0}
        sizes="100vw"
      />
      <div>
        <StyledLink
          title="internet-blocking-map"
          data-testid="internet-blocking-map-download-link"
          onClick={handleDownload}
        >
          kmz
        </StyledLink>
        {' | '}
        <StyledLink href={updatedMap} download="internet-blocking-map.png">
          png
        </StyledLink>
        {showToast && (
          <Toast timeout={5000} type="error">
            An error occurred when downloading the file.{' '}
            <StyledExternalLink href="mailto:connectingcommunitiesbc@gov.bc.ca">
              Email us.
            </StyledExternalLink>
          </Toast>
        )}
      </div>
    </StyledDiv>
  );
};

export default ZoneMapWidget;
