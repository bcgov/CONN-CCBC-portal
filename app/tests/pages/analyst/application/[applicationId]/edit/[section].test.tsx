import { act, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { schema } from 'formSchema';
import EditApplication from 'pages/analyst/application/[applicationId]/edit/[section]';
import compiledSectionQuery, {
  SectionQuery,
} from '__generated__/SectionQuery.graphql';
import PageTestingHelper from 'tests/utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        formData: {
          formSchemaId: 1,
          jsonData: {},
          formByFormSchemaId: {
            jsonSchema: schema,
          },
        },
        status: 'received',
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

const pageTestingHelper = new PageTestingHelper<SectionQuery>({
  pageComponent: EditApplication,
  compiledQuery: compiledSectionQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The analyst edit application page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'projectInformation' },
    });
  });

  it('displays the correct header', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Application' })
    ).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Project information' })
    ).toBeInTheDocument();
  });

  it('displays the save and cancel buttons', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should calculate values on estimatedProjectEmployment page', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'estimatedProjectEmployment' },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const people = screen.getAllByLabelText(/Number of people/)[0];
    const hours = screen.getAllByLabelText(/Hours of employment/)[0];
    const months = screen.getAllByLabelText(/Total person months/)[0];

    await userEvent.type(people, '12');
    await userEvent.type(hours, '40');
    await userEvent.type(months, '20');

    expect(screen.getByText(22.9)).toBeInTheDocument();
  });

  it('should set the correct calculated value on the project funding page', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'projectFunding' },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await userEvent.type(screen.getAllByLabelText(/2022-23/)[0], '1');
    await userEvent.type(screen.getAllByLabelText(/2023-24/)[0], '2');
    await userEvent.type(screen.getAllByLabelText(/2024-25/)[0], '3');
    await userEvent.type(screen.getAllByLabelText(/2025-26/)[0], '4');
    await userEvent.type(screen.getAllByLabelText(/2026-27/)[0], '5');

    expect(
      screen.getByLabelText('Total amount requested under CCBC')
    ).toHaveValue('$15');
  });

  it('displays the confirmation modal and calls the mutation on save', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const formSaveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(formSaveButton);
    });

    const textarea = screen.getAllByTestId('reason-for-change')[1];

    fireEvent.change(textarea, { target: { value: 'test text' } });

    const saveButton = screen.getByTestId('hidden-submit');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled('createNewFormDataMutation', {
      input: {
        applicationRowId: 1,
        jsonData: {
          projectInformation: {},
        },
        reasonForChange: 'test text',
        formSchemaId: 1,
      },
    });

    act(() => {
      pageTestingHelper.environment.mock.resolveMostRecentOperation({
        data: {
          formData: {
            jsonData: {},
          },
        },
      });
    });
  });
});
