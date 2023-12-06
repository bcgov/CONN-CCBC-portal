import { WidgetProps } from '@rjsf/core';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';
import { ZONE_MAP_URL } from 'data/externalConstants';

const ZoneMapWidget: React.FC<WidgetProps> = () => {
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

  const handleDownload = (e: any) => {
    e.preventDefault();
    fetch(ZONE_MAP_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'internet-blocking-map.pdf';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  };

  return (
    <StyledDiv>
      <StyledImage
        src="/images/internet-blocking-map.png"
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
          Download
        </StyledLink>
      </div>
    </StyledDiv>
  );
};

export default ZoneMapWidget;
