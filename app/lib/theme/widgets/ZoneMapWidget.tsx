import { WidgetProps } from '@rjsf/core';
import * as Sentry from '@sentry/nextjs';
import styled from 'styled-components';

const ZoneMapWidget: React.FC<WidgetProps> = () => {
  
  const StyledLink = styled.a`
    color: ${(props) => props.theme.color.links};
    text-decoration-line: underline;
    :hover {
      cursor: pointer;
    }
  `;

  const downloadUrl =
    'https://catalogue.data.gov.bc.ca/dataset/8fbfc57f-4381-4a10-a4e8-0f335c6fe39a/resource/260b608d-e5a5-493c-a403-4e0763631e70/download/internet-blocking-map-11x17-overview.pdf';

  const handleDownload = (e: any) => {
    e.preventDefault();
    fetch(downloadUrl)
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
        window.alert(
          'An error occurred when downloading the file. Contact the CCBC Portal administrator'
        );
        Sentry.captureException(error);
      });
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <img
        src="/images/internet-blocking-map.png"
        alt="Internet Blocking Map"
        style={{ height: '100%', marginBottom: '0px' }}
      />
      <div style={{ marginTop: '10px' }}>
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
