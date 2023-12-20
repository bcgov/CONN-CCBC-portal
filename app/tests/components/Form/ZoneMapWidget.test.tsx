import { act, fireEvent, render, screen } from '@testing-library/react';
import { ZONE_MAP_URL } from 'data/externalConstants';
import type { JSONSchema7 } from 'json-schema';
import { ZoneMapWidget } from 'lib/theme/widgets';
import FormTestRenderer from 'tests/utils/formTestRenderer';
import * as Sentry from '@sentry/nextjs';

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

const formContextMock = {
  fullFormData: {
    projectArea: {
      firstNationsLed: true,
    },
  },
};

const renderStaticLayout = (
  schema: JSONSchema7,
  uiSchema: JSONSchema7,
  formContext: any = {}
) => {
  return render(
    <FormTestRenderer
      formData={{}}
      onSubmit={jest.fn}
      schema={schema as JSONSchema7}
      uiSchema={uiSchema}
      formContext={formContext}
    />
  );
};

describe('The Area Map Widget', () => {
  it('renders download link', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
    expect(
      screen.getByTestId('internet-blocking-map-download-link')
    ).toBeInTheDocument();
  });

  it('renders a map with the correct source', () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
    const imageElement: any = screen.getByAltText('Internet Blocking Map');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain('zone-map-intake-3.png');
  });

  it('should render the default map if firstNationsLed selected', async () => {
    renderStaticLayout(
      mockSchema as JSONSchema7,
      mockUiSchema as JSONSchema7,
      formContextMock
    );

    const initialImageElement: any = screen.getByAltText(
      'Internet Blocking Map'
    );
    expect(initialImageElement).toBeInTheDocument();
    expect(initialImageElement.src).toContain('zone-map.png');
  });

  it('triggers the download process on download click', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
    const mockBlob = new Blob();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(mockBlob),
      })
    ) as jest.Mock;
    const mockObjectURL = jest.fn().mockReturnValue('mockUrl');

    Object.defineProperty(global.URL, 'createObjectURL', {
      value: mockObjectURL,
    });
    const downloadLink: any = screen.getByTestId(
      'internet-blocking-map-download-link'
    );
    expect(downloadLink).toBeVisible();
    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(global.fetch).toHaveBeenCalledWith(ZONE_MAP_URL);
    expect(mockObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it('displays an error message if the download fails', async () => {
    renderStaticLayout(mockSchema as JSONSchema7, mockUiSchema as JSONSchema7);
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));
    const spySentry = jest.spyOn(Sentry, 'captureException');
    const downloadLink = screen.getByTestId(
      'internet-blocking-map-download-link'
    );
    await act(async () => {
      fireEvent.click(downloadLink);
    });

    expect(spySentry).toHaveBeenCalledWith(new Error('Failed to fetch'));
  });
});
