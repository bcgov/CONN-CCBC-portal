import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { FormBase } from 'components/Form/';
import { getClientEnvironment } from 'lib/relay/client';
import defaultTheme from 'lib/theme/DefaultTheme';
import GlobalTheme from 'styles/GlobalTheme';
import { RJSFSchema } from '@rjsf/utils';
import { useRelayNextjs } from 'relay-nextjs/app';

type Props = {
  formData: any;
  onSubmit: () => void;
  schema: RJSFSchema;
  uiSchema: any;
  formContext: any;
};

const FormTestRenderer: React.FC<Props> = ({
  formData,
  onSubmit,
  schema,
  uiSchema,
  formContext = null,
}) => {
  const { env } = useRelayNextjs(null, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

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
        />
      </GlobalTheme>
    </RelayEnvironmentProvider>
  );
};
export default FormTestRenderer;
