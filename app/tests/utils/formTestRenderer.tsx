import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { FormBase } from 'components/Form/';
import type { JSONSchema7 } from 'json-schema';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from 'lib/relay/client';
import defaultTheme from 'lib/theme/DefaultTheme';
import GlobalTheme from 'styles/GlobalTheme';

type Props = {
  formData: any;
  onSubmit: () => void;
  schema: JSONSchema7;
  uiSchema: any;
};

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const FormTestRenderer: React.FC<Props> = ({
  formData,
  onSubmit,
  schema,
  uiSchema,
}) => {
  const relayProps = getRelayProps({}, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

  return (
    <RelayEnvironmentProvider environment={env}>
      <GlobalTheme>
        <FormBase
          theme={defaultTheme}
          formData={formData}
          onSubmit={onSubmit}
          schema={schema as JSONSchema7}
          uiSchema={uiSchema}
        />
      </GlobalTheme>
    </RelayEnvironmentProvider>
  );
};
export default FormTestRenderer;
