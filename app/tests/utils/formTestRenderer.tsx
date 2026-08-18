import { RelayEnvironmentProvider } from 'react-relay';
import { FormBase } from 'components/Form/';
import { getClientEnvironment } from 'lib/relay/client';
import defaultTheme from 'lib/theme/DefaultTheme';
import GlobalTheme from 'styles/GlobalTheme';
import { RJSFSchema } from '@rjsf/utils';
import UnsavedChangesProvider from 'components/UnsavedChangesProvider';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { useRef, useState } from 'react';
import { IChangeEvent } from '@rjsf/core';
import { FormBaseRef } from 'components/Form/FormBase';
import createMockRouter from './mockNextRouter';

type Props = {
  formData: any;
  onSubmit: () => void;
  schema: RJSFSchema;
  uiSchema: any;
  formContext: any;
};

const clientEnv = getClientEnvironment();

const FormTestRenderer: React.FC<Props> = ({
  formData,
  onSubmit,
  schema,
  uiSchema,
  formContext = null,
}) => {
  const [formState, setFormState] = useState(formData);
  const formRef = useRef<FormBaseRef>(null);

  const handleSubmit = () => {
    onSubmit();
    formRef.current?.resetFormState({});
  };

  return (
    <RelayEnvironmentProvider environment={clientEnv!}>
      <GlobalTheme>
        <RouterContext.Provider value={createMockRouter()}>
          <UnsavedChangesProvider>
            <FormBase
              ref={formRef}
              theme={defaultTheme}
              formData={formState}
              onSubmit={handleSubmit}
              schema={schema as RJSFSchema}
              uiSchema={uiSchema}
              formContext={formContext}
              onChange={(e: IChangeEvent) => setFormState(e.formData)}
            >
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setFormState({})}>
                Cancel
              </button>
            </FormBase>
          </UnsavedChangesProvider>
        </RouterContext.Provider>
      </GlobalTheme>
    </RelayEnvironmentProvider>
  );
};
export default FormTestRenderer;
