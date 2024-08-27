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

const renderStaticLayout = (schema: RJSFSchema, uiSchema: RJSFSchema) => {
  return render(
    <FormTestRenderer
      formData={{
        communitySourceData: {
          economicRegion: 'Economic Region 1',
          regionalDistrict: 'Regional District 1',
          bcGeographicName: 'Geographic Name 1',
          geographicNameId: 1,
        },
      }}
      onSubmit={jest.fn}
      schema={schema as RJSFSchema}
      uiSchema={uiSchema}
      formContext={{
        economicRegions: ['Economic Region 1'],
        regionalDistrictsByEconomicRegion: {
          'Economic Region 1': ['Regional District 1'],
        },
        geographicNamesByRegionalDistrict: {
          'Economic Region 1': {
            'Regional District 1': [{ label: 'Geographic Name 1', value: 1 }],
            null: [],
          },
        },
        cbcCommunitiesData: [],
        addedCommunities: [1],
      }}
    />
  );
};

describe('The Community Source Widget', () => {
  beforeEach(() => {
    renderStaticLayout(mockSchema as RJSFSchema, mockUiSchema as RJSFSchema);
  });

  it('should render the economic region input field', () => {
    expect(screen.getByLabelText('Economic Region')).toBeInTheDocument();
  });

  it('should render the regional district input field', () => {
    expect(screen.getByLabelText('Regional District')).toBeInTheDocument();
  });

  it('should render the geographic name input field', () => {
    expect(screen.getByLabelText('Geographic Name')).toBeInTheDocument();
  });

  it('should contain the correct economic region value', async () => {
    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Economic Region 1', { exact: false })
      ).toBeInTheDocument();
    });
  });

  it('should contain the correct regional district value', () => {
    expect(screen.getByDisplayValue('Regional District 1')).toBeInTheDocument();
  });

  it('should contain the correct geographic name value', () => {
    expect(screen.getByDisplayValue('Geographic Name 1')).toBeInTheDocument();
  });

  it('should clear the economic region, regional district, and geographic name value when clear button is clicked', () => {
    expect(screen.getByDisplayValue('Economic Region 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Clear')[0]);
    expect(
      screen.queryByDisplayValue('Economic Region 1')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByDisplayValue('Regional District 1')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByDisplayValue('Geographic Name 1')
    ).not.toBeInTheDocument();
  });

  it('should clear the regional district value when clear button is clicked', () => {
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
    expect(screen.getByDisplayValue('Geographic Name 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTitle('Clear')[2]);
    expect(
      screen.queryByDisplayValue('Geographic Name 1')
    ).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Economic Region 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Regional District 1')).toBeInTheDocument();
  });
});
