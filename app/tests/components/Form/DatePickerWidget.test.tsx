import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import FormTestRenderer from '../../utils/formTestRenderer';

const mockSchema = {
  title: 'Datepicker widget test',
  type: 'object',
  required: ['datepickerTestField'],
  properties: {
    datepickerTestField: {
      title: 'Datepicker test field',
      type: 'string',
    },
  },
};

const mockUiSchema = {
  radioWidgetTestField: {
    'ui:widget': 'DatepickerWidget',
  },
};

const renderStaticLayout = (schema: JSONSchema7, uiSchema) =>
  render(
    <FormTestRenderer
      formData={{}}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );

describe('The Datepicker widget', () => {
  beforeEach(() => {});

  it('should render the radio widget title', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    expect(screen.getByText('Datepicker test field')).toBeVisible();

    expect(screen.getByText('Datepicker test field')).toBeVisible();
  });

  it('should render radio widget options', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    const datepicker = screen.getByTestId('root_datepickerTestField');

    fireEvent.change(datepicker, { target: { value: '1293-08-23' } });

    expect(datepicker).toHaveValue('1293-08-23');
  });
});
