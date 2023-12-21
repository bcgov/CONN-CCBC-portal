import { screen } from '@testing-library/react';
import { NextPageContext } from 'next';
import { schema, schemaV2 } from 'formSchema';
import userEvent from '@testing-library/user-event';
import * as moduleApi from '@growthbook/growthbook-react';
import { withRelayOptions } from '../../../../pages/applicantportal/form/[id]/success';
import FormPage from '../../../../pages/applicantportal/form/[id]/[page]';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import compiledPageQuery, {
  PageQuery,
} from '../../../../__generated__/PageQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        status: 'draft',
        ccbcNumber: 'CCBC-010001',
        intakeByIntakeId: {
          ccbcIntakeNumber: 1,
          closeTimestamp: '2022-09-06T23:59:59-07:00',
        },
        projectName: 'Project testing title',
        updatedAt: '2022-08-15T16:43:28.973734-04:00',
        formData: {
          formByFormSchemaId: {
            jsonSchema: schema,
          },
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      allForms: {
        nodes: [
          {
            rowId: 10,
            jsonSchema: schemaV2,
          },
        ],
      },
    };
  },
};

const mockForceLatestSchema: moduleApi.FeatureResult<moduleApi.JSONValue> = {
  value: true,
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'draft_apps_use_latest_schema',
};

const mockAcceptedZones: moduleApi.FeatureResult<moduleApi.JSONValue> = {
  value: '1,2,3,4,5',
  source: 'defaultValue',
  on: null,
  off: null,
  ruleId: 'intake_zones',
};

const pageTestingHelper = new PageTestingHelper<PageQuery>({
  pageComponent: FormPage,
  compiledQuery: compiledPageQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The form page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '1' },
    });
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(
      screen.getByText('Estimated project employment')
    ).toBeInTheDocument();
  });

  it('does not display the alert or info banner when editing a draft application', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.queryByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeNull();

    expect(
      screen.queryByText('Edits are automatically saved and submitted.')
    ).toBeNull();
  });

  it('displays the info banner when editing a submitted application', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'submitted',
            ccbcNumber: 'CCBC-010001',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
            },
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText('Edits are automatically saved and submitted.')
    ).toBeInTheDocument();
  });

  it('displays the alert banner when editing a withdrawn application', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            status: 'withdrawn',
            ccbcNumber: 'CCBC-010002',
            intakeByIntakeId: {
              ccbcIntakeNumber: 1,
              closeTimestamp: '2022-09-06T23:59:59-07:00',
            },
            projectName: 'Project testing title',
            updatedAt: '2022-08-15T16:43:28.973734-04:00',
            formData: {
              formByFormSchemaId: {
                jsonSchema: schema,
              },
            },
          },
          session: {
            sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
          },
        };
      },
    };

    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();

    expect(
      screen.getByText(
        'You can no longer edit this application because it is withdrawn.'
      )
    ).toBeInTheDocument();
  });
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/form/1/1',
      },
    } as NextPageContext;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/applicantportal',
      },
    });
  });

  it('uses the latest schema if the flag is on and estimated project employment is not present', async () => {
    // jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockForceLatestSchema);
    jest.spyOn(moduleApi, 'useFeature').mockImplementation((id) => {
      if (id === 'intake_zones') {
        return mockAcceptedZones;
      }
      return mockForceLatestSchema;
    });

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Benefits')).toBeInTheDocument();

    const estimatedProjectEmployment = screen.queryByText(
      'Estimated project employment'
    );

    expect(estimatedProjectEmployment).toBeNull();
  });

  it('shows accepted project areas and handles modal', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const projectAreasText = screen.getByText(
      new RegExp(`within zones ${mockAcceptedZones.value?.toString()}`)
    );
    expect(projectAreasText).toBeInTheDocument();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    await userEvent.click(areas[5]);

    expect(
      screen.getByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).toBeInTheDocument();

    const modalOkButton = screen.getByTestId('project-modal-ok');

    await userEvent.click(modalOkButton);
  });

  it('handles modal correctly when first nation based and not an available zone', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    const fnQuestion = screen.getAllByLabelText('Yes')[0];

    await userEvent.click(fnQuestion);
    await userEvent.click(areas[5]);

    expect(
      screen.queryByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).not.toBeInTheDocument();
  });

  it('handles modal correctly when not first nation based and not an available zone', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { id: '1', page: '2' },
    });

    jest.spyOn(moduleApi, 'useFeature').mockReturnValue(mockAcceptedZones);

    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const areas = screen.getAllByLabelText(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );
    expect(areas).toHaveLength(14);

    const fnQuestion = screen.getAllByLabelText('No')[0];

    await userEvent.click(fnQuestion);
    await userEvent.click(areas[5]);

    expect(
      screen.getByText(
        'For this intake, CCBC is considering projects that are in Zones 1, 2, 3, 4, or 5 if the project is not First Nations-led or First Nations-supported.'
      )
    ).toBeInTheDocument();

    const modalOkButton = screen.getByTestId('project-modal-ok');

    await userEvent.click(modalOkButton);
  });
});
