import { WidgetProps } from '@rjsf/core';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';
import Image from 'next/image';
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
    <div style={{ marginBottom: '10px' }}>
      <Image
        src="/images/internet-blocking-map.png"
        alt="Internet Blocking Map"
        width={0}
        height={0}
        sizes="100vw"
        style={{ marginBottom: '0px', width: '100%', height: 'auto' }}
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
    </div>
  );
};

export default ZoneMapWidget;
