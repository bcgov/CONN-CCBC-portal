import { render, screen, fireEvent } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import FormTestRenderer from '../../utils/formTestRenderer';

const mockSchema = {
  title: 'Radio widget test',
  type: 'object',
  required: ['radioWidgetTestField'],
  properties: {
    radioWidgetTestField: {
      title: 'Radio widget test field',
      type: 'boolean',
      enum: [true, false],
      enumNames: ['Yes', 'No'],
    },
  },
};

const mockUiSchema = {
  radioWidgetTestField: {
    'ui:widget': 'RadioWidget',
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

describe('The Radio widget', () => {
  beforeEach(() => {});

  it('should render the radio widget title', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    expect(screen.getByText('Radio widget test field')).toBeVisible();
  });

  it('should render radio widget options', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema);

    expect(screen.getByText('Yes')).toBeVisible();
    expect(screen.getByText('No')).toBeVisible();
  });

  it('should contain the correct input value', () => {
    const { container } = renderStaticLayout(
      mockSchema as JSONSchema7,
      mockUiSchema
    );

    const radioInput1 = container.querySelector(
      `input[name="root_radioWidgetTestField-0"]`
    );

    const radioInput2 = container.querySelector(
      `input[name="root_radioWidgetTestField-1"]`
    );

    expect(radioInput2).not.toBeChecked();
    expect(radioInput1).not.toBeChecked();

    fireEvent.click(radioInput2);

    expect(radioInput2).toBeChecked();
    expect(radioInput1).not.toBeChecked();
  });
});
