import { act, fireEvent, render, screen } from '@testing-library/react';
import { ZONE_MAP_URL } from 'data/externalConstants';
import type { JSONSchema7 } from 'json-schema';
import { ZoneMapWidget } from 'lib/theme/widgets';
import FormTestRenderer from 'tests/utils/formTestRenderer';

const mockSchema = {
  title: 'Project area',
  type: 'object',
  required: ['zoneMapTestField'],
  properties: {
    zoneMapTestField: {
      title: '',
      type: 'string',
    },
  },
};

const mockUiSchema = {
  zoneMapTestField: {
    'ui:widget': ZoneMapWidget,
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

describe('The Area Map Widget', () => {
  beforeEach(() => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
  });

  it('renders download link', () => {
    expect(
      screen.getByTestId('internet-blocking-map-download-link')
    ).toBeInTheDocument();
  });

  it('renders a map with the correct source', () => {
    const imageElement: any = screen.getByAltText('Internet Blocking Map');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain('internet-blocking-map.png');
  });

  it('triggers the download process on download click', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob()),
      })
    ) as jest.Mock;

    const downloadLink: any = screen.getByTestId(
      'internet-blocking-map-download-link'
    );
    expect(downloadLink).toBeVisible();
    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(global.fetch).toHaveBeenCalledWith(ZONE_MAP_URL);
  });

  it('displays an error message if the download fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));
    const spySentry = jest.spyOn(require('@sentry/nextjs'), 'captureException');
    const downloadLink = screen.getByTestId(
      'internet-blocking-map-download-link'
    );
    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(spySentry).toHaveBeenCalledWith(new Error('Failed to fetch'));
  });
});
