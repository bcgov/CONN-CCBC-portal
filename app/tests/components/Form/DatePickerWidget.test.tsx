import { act, render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import { Settings, DateTime } from 'luxon';
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
  datepickerTestField: {
    'ui:widget': 'DatePickerWidget',
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
  beforeEach(() => {
    const mockCurrentTime = DateTime.local(2023, 10, 1, 0, {
      zone: 'America/New_York',
    });
    Settings.now = () => mockCurrentTime.toMillis();
  });

  it('should render the radio widget title', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    expect(screen.getByText('Datepicker test field')).toBeVisible();

    expect(screen.getByText('Datepicker test field')).toBeVisible();
  });

  it('should render radio widget options', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    const datepicker = screen.getByTestId('datepicker-widget-input');

    await act(async () => {
      fireEvent.change(datepicker, { target: { value: '1293-08-23' } });
    });

    expect(datepicker).toHaveValue('1293-08-23');
  });

  it('Should have empty value when cleared', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    const datepicker = screen.getByTestId('datepicker-widget-input');

    await act(async () => {
      fireEvent.change(datepicker, { target: { value: '1293-08-23' } });
    });

    await act(async () => {
      fireEvent.change(datepicker, { target: { value: null } });
    });
    expect(datepicker).toHaveValue('');
  });

  it('Should display correct date in any timezone', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    const datepicker = screen.getByTestId('datepicker-widget-input');

    await act(async () => {
      fireEvent.change(datepicker, { target: { value: '2023-10-01' } });
    });
    expect(datepicker).toHaveValue('2023-10-01');
  });

  it('Should have the correct style when there is an error', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    const datepickerFieldset = screen.getByTestId('datepicker-widget-container')
      .children[0].children[0].children[2];

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(datepickerFieldset).toHaveStyle('border: 2px solid #E71F1F;');
  });
});
