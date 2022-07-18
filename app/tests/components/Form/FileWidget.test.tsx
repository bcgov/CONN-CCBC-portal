import FormTestRenderer from '../../utils/formTestRenderer';
import { render, screen, waitFor } from '@testing-library/react';
import type { JSONSchema7 } from 'json-schema';
import userEvent from '@testing-library/user-event';

const schema = {
  title: 'File widget test',
  type: 'object',
  properties: {
    fileWidget: { type: 'string', title: 'File widget test' },
  },
};

const uiSchema = {
  fileWidget: {
    'ui:widget': 'FileWidget',
    'ui:description': 'File upload test description',
  },
};

const uiSchemaMultipleFiles = {
  fileWidget: {
    'ui:widget': 'FileWidget',
    'ui:description':
      'File upload with multiple files enabled test description',
    'ui:options': {
      allowMultipleFiles: true,
    },
  },
};

const renderStaticLayout = (schema: JSONSchema7, uiSchema: JSONSchema7) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={() => console.log('test')}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
    />
  );
};

describe('The FileWidget', () => {
  beforeEach(() => {
    renderStaticLayout(schema as JSONSchema7, uiSchema as JSONSchema7);
  });

  it('should render the upload button', () => {
    expect(screen.getByText('Upload'));
  });

  it('should render the file widget description', () => {
    expect(screen.getByText('File upload test description'));
  });

  it('should render the correct label once file has been uploaded', async () => {
    const file = new File([new ArrayBuffer(1)], 'file.jpg');

    const inputFile = screen.getByTestId('file-test');

    await userEvent
      .upload(inputFile, file)
      .then(() => {
        waitFor(() => expect(screen.getByText('Replace')));
      })
      .then(() => {
        waitFor(() => expect(screen.getByText('file.jpg')));
      });
  });
});

describe('The FileWidget with multiple files enabled', () => {
  beforeEach(() => {
    renderStaticLayout(
      schema as JSONSchema7,
      uiSchemaMultipleFiles as JSONSchema7
    );
  });

  it('should render the upload button', () => {
    expect(screen.getByText('Upload(s)'));
  });

  it('should render the file widget description', () => {
    expect(
      screen.getByText(
        'File upload with multiple files enabled test description'
      )
    );
  });

  it('should render the correct labels when multiple files have been uploaded', async () => {
    const file = new File([new ArrayBuffer(1)], 'file.jpg');
    const file2 = new File([new ArrayBuffer(1)], 'file-2.jpg');
    const file3 = new File([new ArrayBuffer(1)], 'file-3.jpg');

    const inputFile = screen.getByTestId('file-test');

    await userEvent
      .upload(inputFile, file)
      .then(() => {
        waitFor(() => expect(screen.getByText('Add file')));
      })
      .then(() => {
        waitFor(() => expect(screen.getByText('file.jpg')));
      });

    await userEvent
      .upload(inputFile, file2)
      .then(() => {
        waitFor(() => expect(screen.getByText('Add file')));
      })
      .then(() => {
        waitFor(() => expect(screen.getByText('file-2.jpg')));
      });

    await userEvent
      .upload(inputFile, file3)
      .then(() => {
        waitFor(() => expect(screen.getByText('Add file')));
      })
      .then(() => {
        waitFor(() => expect(screen.getByText('file-3.jpg')));
      });
  });
});
