import React, { useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';
import { ZONE_MAP_URL, ZONE_MAP_URL_INTAKE_4 } from 'data/externalConstants';
import { Toast } from 'components';

interface StyledLinkProps {
  children: React.ReactNode;
  href?: string;
  download?: string;
  title?: string;
  'data-testid'?: string;
  onClick?: (e: any) => void;
}

const StyledLink = styled.a<StyledLinkProps>`
  color: ${(props) => props.theme.color.links};
  text-decoration-line: underline;
  margin-left: 0.5%;
  :hover {
    cursor: pointer;
  }
`;

interface StyledImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
}

const StyledImage = styled.img<StyledImageProps>`
  margin-bottom: 0px;
  width: 100%;
  height: auto;
`;

interface StyledDivProps {
  children: React.ReactNode;
}

const StyledDiv = styled.div<StyledDivProps>`
  margin-bottom: 3%;
`;

interface StyledExternalLinkProps {
  children: React.ReactNode;
  href: string;
}

const StyledExternalLink = styled.a<StyledExternalLinkProps>`
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

  const updatedMapIntakeFour = '/images/zone-map-intake-4.png';

  // TODO: uncomment and update this to the correct image in later PR
  const updatedMapIntakeFive = '/images/zone-map-intake-5.png';

  const intakeNumber = formContext?.intakeNumber;

  const isIntakeFourOrFive = intakeNumber >= 4;

  const updatedMapDict = {
    3: updatedMap,
    4: updatedMapIntakeFour,
    // TODO: update this to the correct image in later PR
    5: updatedMapIntakeFive,
  };

  const zoneMapUrlDict = {
    3: ZONE_MAP_URL,
    4: ZONE_MAP_URL_INTAKE_4,
    5: ZONE_MAP_URL_INTAKE_4,
  };

  // default map for intake 3
  const zoneMapUrl = zoneMapUrlDict[intakeNumber] ?? ZONE_MAP_URL_INTAKE_4;

  // default links for intake 3
  const updatedMapUrl = updatedMapDict[intakeNumber] ?? updatedMapIntakeFive;

  const handleDownload = (e: any) => {
    e.preventDefault();
    setShowToast(false);
    fetch(zoneMapUrl)
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
        src={updatedMapUrl}
        alt="Internet Blocking Map"
        width={0}
        height={0}
        sizes="100vw"
      />
      <div style={{ marginLeft: isIntakeFourOrFive ? '6%' : '' }}>
        <StyledLink
          title="internet-blocking-map"
          data-testid="internet-blocking-map-download-link"
          onClick={handleDownload}
        >
          kmz
        </StyledLink>
        {' | '}
        <StyledLink href={updatedMapUrl} download="internet-blocking-map.png">
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
