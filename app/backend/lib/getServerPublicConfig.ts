import config from '../../config';
import { PublicConfig } from '../../components/PublicConfigProvider';

const getServerPublicConfig = (): PublicConfig => ({
  OPENSHIFT_APP_NAMESPACE: config.get('OPENSHIFT_APP_NAMESPACE'),
  ENABLE_MOCK_TIME: config.get('ENABLE_MOCK_TIME'),
  COVERAGES_FILE_NAME: config.get('COVERAGES_FILE_NAME'),
});

export default getServerPublicConfig;
