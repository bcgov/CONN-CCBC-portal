import { act, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { schema } from 'formSchema';
import EditApplication from 'pages/analyst/application/[applicationId]/edit/[section]';
import compiledSectionQuery, {
  SectionQuery,
} from '__generated__/SectionQuery.graphql';
import PageTestingHelper from 'tests/utils/pageTestingHelper';
import { mocked } from 'jest-mock';
import useEmailNotification from 'lib/helpers/useEmailNotification';

jest.mock('lib/helpers/useEmailNotification');

const mockNotifyHHCountUpdate = jest.fn();
mocked(useEmailNotification).mockReturnValue({
  notifyHHCountUpdate: mockNotifyHHCountUpdate,
  notifyDocumentUpload: jest.fn(),
});

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        ccbcNumber: 'CCBC-10001',
        organizationName: 'test org',
        projectName: 'test project',
        formData: {
          formSchemaId: 1,
          jsonData: {
            benefits: {
              numberOfHouseholds: 12,
              householdsImpactedIndigenous: 13,
            },
          },
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

    expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should go back on cancel button', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(window.location.hash).toBe('');
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

  it('shows modal on enter key', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'estimatedProjectEmployment' },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const people = screen.getAllByLabelText(/Number of people/)[0];

    await userEvent.type(people, '{enter}');

    const modalElement = screen.getByTestId('change-modal');

    expect(modalElement).toBeInTheDocument();
  });

  it('changes the save button text on form change', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();

    await userEvent.type(
      screen.getByTestId('root_projectTitle'),
      'test project'
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('displays the confirmation modal and calls the mutation on save', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await userEvent.type(
      screen.getByTestId('root_projectTitle'),
      'test project'
    );

    const formSaveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(formSaveButton);
    });

    const textarea = screen.getAllByTestId('reason-for-change')[0];

    fireEvent.change(textarea, { target: { value: 'test text' } });

    const saveButton = screen.getAllByTestId('status-change-save-btn')[0];

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled('createNewFormDataMutation', {
      input: {
        applicationRowId: 1,
        jsonData: {
          benefits: {
            numberOfHouseholds: 12,
            householdsImpactedIndigenous: 13,
          },
          projectInformation: {
            projectTitle: 'test project',
          },
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

  it('trigger email notification for manual hh count updates', async () => {
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1', section: 'benefits' },
    });
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    await userEvent.type(screen.getByTestId('root_numberOfHouseholds'), '2');

    const formSaveButton = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.click(formSaveButton);
    });

    const textarea = screen.getAllByTestId('reason-for-change')[0];

    fireEvent.change(textarea, { target: { value: 'test text' } });

    const saveButton = screen.getAllByTestId('status-change-save-btn')[0];

    await act(async () => {
      fireEvent.click(saveButton);
    });

    pageTestingHelper.expectMutationToBeCalled('createNewFormDataMutation', {
      input: {
        applicationRowId: 1,
        jsonData: {
          benefits: {
            numberOfHouseholds: 122,
            householdsImpactedIndigenous: 13,
          },
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

    expect(mockNotifyHHCountUpdate).toHaveBeenCalledWith(
      {
        numberOfHouseholds: 122,
        householdsImpactedIndigenous: 13,
      },
      { householdsImpactedIndigenous: 13, numberOfHouseholds: 12 },
      '1',
      {
        ccbcNumber: 'CCBC-10001',
        manualUpdate: true,
        reasonProvided: 'test text',
        timestamp: expect.any(String),
      }
    );
  });
});
