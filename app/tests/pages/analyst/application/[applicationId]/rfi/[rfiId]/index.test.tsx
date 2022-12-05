import { screen } from '@testing-library/react';
import RfiId from 'pages/analyst/application/[applicationId]/rfi/[rfiId]';
import userEvent from '@testing-library/user-event';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import compiledhistoryQuery, {
  historyQuery,
} from '__generated__/historyQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        formData: {
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: {},
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      allAnalysts: {
        nodes: [
          {
            rowId: 1,
            givenName: 'Test',
            familyName: '1',
          },
          {
            rowId: 2,
            givenName: 'Test',
            familyName: '2',
          },
        ],
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<historyQuery>({
  pageComponent: RfiId,
  compiledQuery: compiledhistoryQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', rfiId: '1' },
    });
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'RFI' })).toBeInTheDocument();
  });

  it('displays the RFI type section', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('RFI type')).toBeInTheDocument();
    expect(
      screen.getByText('Missing files or information')
    ).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('displays the Due by section', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Due by')).toBeInTheDocument();
  });

  it('displays the Email correspondence section', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Email correspondence')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Upload',
      })
    ).toBeVisible();
  });

  it('displays the Request replacement or additional files section', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('Template 1 - Eligibility & impacts Calculator')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 2 - Detailed Budget')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 3 - Financial Forecast')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 4 - Last Mile Internet Service Offering')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Template 5 - List of Points of Presence and Wholesale Pricing'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 6 - Community and Rural Development Benefits')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 7 - Wireless Addendum')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 8 - Supporting Connectivity Evidence')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 9 - Backbone & Geographic Names')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Template 10 - Equipment Details')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Copies of registration and other relevant documents')
    ).toBeInTheDocument();

    expect(screen.getByText('Financial statements')).toBeInTheDocument();

    expect(screen.getByText('Logical Network Diagram')).toBeInTheDocument();

    expect(screen.getByText('Project schedule')).toBeInTheDocument();

    expect(
      screen.getByText('Benefits supporting documents')
    ).toBeInTheDocument();

    expect(screen.getByText('Other supporting materials')).toBeInTheDocument();

    expect(
      screen.getByText('Coverage map from Eligibility Mapping Tool')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Coverage Assessment and Statistics')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Current network infrastructure')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Proposed or Upgraded Network Infrastructure')
    ).toBeInTheDocument();
  });

  it('displays the Save and Cancel buttons', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Email correspondence')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Save',
      })
    ).toBeVisible();

    expect(
      screen.getByRole('button', {
        name: 'Cancel',
      })
    ).toBeVisible();
  });

  it('calls the mutation on save', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    const user = userEvent.setup();

    const button = screen.getByRole('button', {
      name: 'Save',
    });

    await user.click(button);

    pageTestingHelper.expectMutationToBeCalled('createRfiMutation', {
      input: {
        applicationRowId: 1,
        jsonData: {},
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
