import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { FormBase } from 'components/Form/';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from 'lib/relay/client';
import defaultTheme from 'lib/theme/DefaultTheme';
import GlobalTheme from 'styles/GlobalTheme';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';

type Props = {
  formData: any;
  onSubmit: () => void;
  schema: RJSFSchema;
  uiSchema: any;
  formContext: any;
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
  formContext = null,
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
          schema={schema as RJSFSchema}
          uiSchema={uiSchema}
          formContext={formContext}
          validator={validator}
        />
      </GlobalTheme>
    </RelayEnvironmentProvider>
  );
};
export default FormTestRenderer;
