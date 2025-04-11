import FormTestRenderer from 'tests/utils/formTestRenderer';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import CommunitySourceWidget from 'lib/theme/widgets/custom/CommunitySourceWidget';
import { RJSFSchema } from '@rjsf/utils';

const mockSchema = {
  title: 'Community Source Widget Test',
  type: 'object',
  properties: {
    communitySourceData: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        enum: [],
      },
    },
  },
};

const mockUiSchema = {
  communitySourceData: {
    'ui:widget': CommunitySourceWidget,
  },
};

const mockFormData = {
  communitySourceData: {
    economicRegion: 'Economic Region 1',
    regionalDistrict: 'Regional District 1',
    bcGeographicName: 'Geographic Name 1',
    geographicType: 'Community',
    geographicNameId: 1,
  },
};

const mockFormDataDisplayField = {
  communitySourceData: {
    economicRegion: 'Economic Region 2',
    regionalDistrict: 'Regional District 2',
    bcGeographicName: 'Geographic Name 2',
    geographicType: 'City',
    geographicNameId: 2,
    rowId: 2,
  },
};

const renderStaticLayout = (
  schema: RJSFSchema,
  uiSchema: RJSFSchema,
  formData?: any,
  formContext?: any
) => {
  return render(
    <FormTestRenderer
      formData={formData ?? mockFormData}
      onSubmit={jest.fn}
      schema={schema as RJSFSchema}
      uiSchema={uiSchema}
      formContext={
        formContext || {
          economicRegions: ['Economic Region 1'],
          allCommunitiesSourceData: [
            {
              bcGeographicName: 'Geographic Name 1',
              geographicNameId: 1,
              geographicType: 'Community',
              economicRegion: 'Economic Region 1',
              regionalDistrict: 'Regional District 1',
            },
          ],
          regionalDistrictsByEconomicRegion: {
            'Economic Region 1': ['Regional District 1'],
          },
          geographicNamesByRegionalDistrict: {
            'Economic Region 1': {
              'Regional District 1': [
                { label: 'Geographic Name 1', value: 1, type: 'Community' },
              ],
              null: [],
            },
          },
          cbcCommunitiesData: [],
          addedCommunities: [1],
        }
      }
    />
  );
};

describe('The Community Source Widget', () => {
  it('should render the economic region input field', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(screen.getByLabelText('Economic Region')).toBeInTheDocument();
  });

  it('should render the regional district input field', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(screen.getByLabelText('Regional District')).toBeInTheDocument();
  });

  it('should render the geographic name input field', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(
      screen.getByLabelText('Geographic Name, Type & ID')
    ).toBeInTheDocument();
  });

  it('should contain the correct economic region value', async () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Economic Region 1', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should contain the correct regional district value', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(screen.getByDisplayValue('Regional District 1')).toBeInTheDocument();
  });

  it('should contain the correct geographic name value', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(
      screen.getByDisplayValue('Geographic Name 1 | Community | 1')
    ).toBeInTheDocument();
  });

  it('should clear the economic region, regional district, and geographic name value when clear button is clicked', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(screen.getByDisplayValue('Economic Region 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Clear')[0]);
    expect(
      screen.queryByDisplayValue('Economic Region 1')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByDisplayValue('Regional District 1')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByDisplayValue('Geographic Name 1 | Community | 1')
    ).not.toBeInTheDocument();
  });

  it('should clear the regional district value when clear button is clicked', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(screen.getByDisplayValue('Regional District 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Clear')[1]);
    expect(
      screen.queryByDisplayValue('Regional District 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue('Geographic Name 1')
    ).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Economic Region 1')).toBeInTheDocument();
  });

  it('should clear the geographic name value when clear button is clicked', () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    expect(
      screen.getByDisplayValue('Geographic Name 1 | Community | 1')
    ).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Clear')[2]);
    expect(
      screen.queryByDisplayValue('Geographic Name 1')
    ).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Economic Region 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Regional District 1')).toBeInTheDocument();
  });

  it('geographic name autocomplete should contain the correct options with geographic name, type and id', async () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    const geoNameAutoCompleteOpenButton = screen.getAllByTitle('Open')[2];
    fireEvent.click(geoNameAutoCompleteOpenButton);
    const option = screen.getByRole('option', {
      name: /Geographic Name 1/,
    });
    expect(option).toBeInTheDocument();
    expect(option).toHaveTextContent('Geographic Name 1');
    expect(option).toHaveTextContent('Community');
    expect(option).toHaveTextContent('1');
  });

  it('should disable geographic name options if already selected', async () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    const geoNameAutoCompleteOpenButton = screen.getAllByTitle('Open')[2];
    fireEvent.click(geoNameAutoCompleteOpenButton);

    const option = await screen.findByRole('option', {
      name: /Geographic Name 1/,
    });

    expect(option).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show geographic options for economic region when regional district is not selected', async () => {
    renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchema as RJSFSchema,
      {
        communitySourceData: null,
      },
      {
        economicRegions: ['Economic Region 1', 'Economic Region 2'],
        allCommunitiesSourceData: [
          {
            bcGeographicName: 'Geographic Name 1',
            geographicNameId: 1,
            geographicType: 'Community',
            economicRegion: 'Economic Region 1',
            regionalDistrict: 'Regional District 1',
          },
          {
            bcGeographicName: 'Geographic Name 2',
            geographicNameId: 2,
            geographicType: 'City',
            economicRegion: 'Economic Region 2',
            regionalDistrict: 'Regional District 2',
          },
        ],
        regionalDistrictsByEconomicRegion: {
          'Economic Region 1': ['Regional District 1'],
          'Economic Region 2': ['Regional District 2'],
        },
        geographicNamesByRegionalDistrict: {
          'Economic Region 1': {
            'Regional District 1': [
              { label: 'Geographic Name 1', value: 1, type: 'Community' },
            ],
          },
          'Economic Region 2': {
            'Regional District 2': [
              { label: 'Geographic Name 2', value: 2, type: 'City' },
            ],
          },
        },
        cbcCommunitiesData: [],
        addedCommunities: [],
      }
    );

    const erOpenBtn = screen.getAllByTitle('Open')[0];
    fireEvent.click(erOpenBtn);

    const erOption = await screen.findByRole('option', {
      name: /Economic Region 2/,
    });
    fireEvent.click(erOption);

    const geoOptionOpenBtn = screen.getAllByTitle('Open')[2];
    fireEvent.click(geoOptionOpenBtn);

    const option2 = await screen.findByRole('option', {
      name: /Geographic Name 2/,
    });

    const option1 = screen.queryByRole('option', {
      name: /Geographic Name 1/,
    });

    expect(option2).toBeInTheDocument();
    expect(option1).not.toBeInTheDocument();
  });

  it('should auto-populate economic region and regional district after selecting geographic name', async () => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
    const geoOpenButton = screen.getAllByTitle('Open')[2];
    fireEvent.click(geoOpenButton);

    const geoOption = await screen.findByRole('option', {
      name: /Geographic Name 1/,
    });

    fireEvent.click(geoOption);

    await waitFor(() => {
      const economicRegionInput = screen
        .getByTestId('economic-region-textfield')
        .querySelector('input');
      expect(economicRegionInput).toHaveValue('Economic Region 1');

      const regionalDistrictInput = screen
        .getByTestId('regional-district-textfield')
        .querySelector('input');
      expect(regionalDistrictInput).toHaveValue('Regional District 1');
    });
  });
});

describe('The Community Source Widget Display Fields', () => {
  beforeEach(() => {
    renderStaticLayout(
      mockSchema as RJSFSchema,
      mockUiSchema as RJSFSchema,
      mockFormDataDisplayField
    );
  });

  it('should render display fields correctly', async () => {
    expect(screen.getByText('Economic Region 2')).toBeInTheDocument();
    expect(screen.getByText('Regional District 2')).toBeInTheDocument();
    expect(screen.getByText('Geographic Name 2')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
