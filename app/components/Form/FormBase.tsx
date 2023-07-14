import defaultTheme from 'lib/theme/DefaultTheme';
import { useMemo } from 'react';
import styled from 'styled-components';
import validator from '@rjsf/validator-ajv8';
import { FormProps, withTheme, ThemeProps } from '@rjsf/core';
import GenericModal from 'lib/theme/widgets/GenericModal';

interface FormPropsWithTheme<T> extends FormProps<T> {
  theme?: ThemeProps;
}

const FormBase: React.FC<FormPropsWithTheme<any>> = (props) => {
  const { theme, formData, omitExtraData } = props;
  const Form = useMemo(() => withTheme(theme ?? defaultTheme), [theme]);

  const StyledForm = styled(Form)`
    fieldset {
      border: none;
    }
  `;

  return (
    <>
      <GenericModal
        id="file-error"
        title="File error"
        message="This file cannot be downloaded"
      />
      <StyledForm
        {...props}
        formData={formData ?? {}}
        noHtml5Validate
        omitExtraData={omitExtraData ?? true}
        showErrorList={false}
        validator={validator}
      />
    </>
  );
};

export default FormBase;
