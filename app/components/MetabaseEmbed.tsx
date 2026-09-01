import { useEffect, useState } from 'react';
import styled from 'styled-components';
import IframeResizer from 'iframe-resizer-react';
import { usePublicConfig } from 'components/PublicConfigProvider';

const StyledIframe = styled(IframeResizer)`
  margin-top: 16px;
  display: block;
  width: 1px;
  min-width: 100%;
  min-height: 100%;
  height: 100%;
  border: none;
`;

interface Props {
  dashboardNumber: number;
  dashboardNumberTest: number;
}

const MetabaseEmbed: React.FC<Props> = ({
  dashboardNumber,
  dashboardNumberTest,
}) => {
  const { OPENSHIFT_APP_NAMESPACE: namespace } = usePublicConfig();
  const isProd = namespace?.endsWith('-prod');
  const [metabaseUrl, setMetabaseUrl] = useState<string>('');
  const dashboard = isProd ? dashboardNumber : dashboardNumberTest;

  useEffect(() => {
    const url = `/api/metabase-embed-url/${dashboard}`;
    fetch(url).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setMetabaseUrl(data.url);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>{metabaseUrl && <StyledIframe src={metabaseUrl} title="Metabase" />}</>
  );
};

export default MetabaseEmbed;
