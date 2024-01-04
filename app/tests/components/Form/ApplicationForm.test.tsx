import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockFormData from 'tests/utils/mockFormData';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import { schema } from 'formSchema';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import sharedReviewThemeTests from '../Review/ReviewTheme';

const testQuery = graphql`
  query ApplicationFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationId") {
      ...ApplicationForm_application
    }

    query {
      ...ApplicationForm_query
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      formData: {
        id: 'TestFormId',
        rowId: 123,
        jsonData: {},
        formByFormSchemaId: {
          jsonSchema: schema,
        },
        isEditable: true,
        updatedAt: '2022-09-12T14:04:10.790848-07:00',
      },
      status: 'draft',
    };
  },
  Query() {
    return {
      openIntake: {
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const mockQueryPayloadWithFormData = {
  ...mockQueryPayload,
  Application() {
    return {
      formData: {
        id: 'TestFormId',
        jsonData: mockFormData,
        isEditable: true,
        formByFormSchemaId: {
          jsonSchema: schema,
        },
      },
      status: 'draft',
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ApplicationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      pageNumber: 1,
      query: data.query,
    }),
  });

describe('The application form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('saves the data as the user types', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: 'test title' },
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          clientUpdatedAt: '2022-09-12T14:04:10.790848-07:00',
          formDataRowId: 123,
          jsonData: {
            projectInformation: {
              projectTitle: 'test title',
            },
          },
          lastEditedPage: 'projectInformation',
        },
      }
    );
  });

  it('Results in error if data is out of sync', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: 'test title' },
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          clientUpdatedAt: '2022-09-12T14:04:10.790848-07:00',
          formDataRowId: 123,
          jsonData: {
            projectInformation: {
              projectTitle: 'test title',
            },
          },
          lastEditedPage: 'projectInformation',
        },
      }
    );

    act(() => {
      componentTestingHelper.environment.mock.rejectMostRecentOperation(
        new Error('Data is Out of Sync')
      );
    });

    expect(window.location.hash).toBe('#data-out-of-sync');
  });

  it('sets lastEditedPage to the next page when the user clicks on "continue"', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save and continue' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          clientUpdatedAt: '2022-09-12T14:04:10.790848-07:00',
          formDataRowId: 123,
          jsonData: {
            projectInformation: {},
          },
          lastEditedPage: 'projectArea',
        },
      }
    );
  });

  it('acknowledgement page continue is disabled on initial load', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', {
        name: 'Save and continue',
      })
    ).toBeDisabled();
  });

  it('acknowledgement page continue is enabled once all checkboxes have been clicked', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    const checkBoxes = screen.getAllByRole('checkbox');

    const lastCheckBox = checkBoxes.pop();

    checkBoxes.forEach(async (acknowledgement) => {
      await userEvent.click(acknowledgement);
    });

    expect(
      screen.getByRole('button', { name: 'Save and continue' })
    ).toBeDisabled();

    await act(async () => {
      await userEvent.click(lastCheckBox);
    });

    const updateFormRequest =
      componentTestingHelper.environment.mock.getMostRecentOperation();

    act(() => {
      componentTestingHelper.environment.mock.complete(updateFormRequest);
    });

    expect(
      screen.getByRole('button', { name: 'Save and continue' })
    ).toBeEnabled();
  });

  it('displays the correct button label for withdrawn applications', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'withdrawn',
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {
              id: 'TestFormId',
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();

    expect(screen.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  it('Acknowledgement fields are disabled when visiting submitted application', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationId',
          status: 'submitted',
          formData: {
            jsonData: {
              id: 'TestFormId',
            },
            formByFormSchemaId: {
              jsonSchema: schema,
            },
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    const checkBoxes = screen.getAllByRole('checkbox');

    checkBoxes.forEach((checkBox) => {
      expect(checkBox.hasAttribute('disabled')).toBeTrue();
    });
  });

  it('acknowledgement page shows continue on submitted application', async () => {
    const mockSubmittedQueryPayload = {
      Application() {
        return {
          id: 'TestApplicationId',
          formData: {
            jsonData: {
              id: 'TestFormId',
            },
            formByFormSchemaId: {
              jsonSchema: schema,
            },
          },
          status: 'submitted',
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockSubmittedQueryPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('should set the correct calculated value on the employment page', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 10,
      query: data.query,
    }));

    const people = screen.getAllByLabelText(/Number of people/)[0];
    const hours = screen.getAllByLabelText(/Hours of employment/)[0];
    const months = screen.getAllByLabelText(/Total person months/)[0];

    await userEvent.type(people, '12');
    await userEvent.type(hours, '40');
    await userEvent.type(months, '20');

    expect(screen.getByText(22.9)).toBeInTheDocument();

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          clientUpdatedAt: '2022-09-12T14:04:10.790848-07:00',
          formDataRowId: 123,
          jsonData: {
            estimatedProjectEmployment: {
              estimatedFTECreation: 22.9,
              estimatedFTEContractorCreation: null,
              numberOfEmployeesToWork: 12,
              hoursOfEmploymentPerWeek: 40,
              personMonthsToBeCreated: 20,
            },
          },
          lastEditedPage: 'estimatedProjectEmployment',
        },
      }
    );
  });

  it('should set the correct calculated value on the project page', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 5,
      query: data.query,
    }));

    await userEvent.type(screen.getAllByLabelText(/2022-23/)[0], '1');
    await userEvent.type(screen.getAllByLabelText(/2023-24/)[0], '2');
    await userEvent.type(screen.getAllByLabelText(/2024-25/)[0], '3');
    await userEvent.type(screen.getAllByLabelText(/2025-26/)[0], '4');
    await userEvent.type(screen.getAllByLabelText(/2026-27/)[0], '5');

    expect(
      screen.getByLabelText('Total amount requested under CCBC')
    ).toHaveValue('$15');

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          clientUpdatedAt: '2022-09-12T14:04:10.790848-07:00',
          formDataRowId: 123,
          jsonData: {
            projectFunding: {
              totalFundingRequestedCCBC: 15,
              totalApplicantContribution: null,
              fundingRequestedCCBC2223: 1,
              fundingRequestedCCBC2324: 2,
              fundingRequestedCCBC2425: 3,
              fundingRequestedCCBC2526: 4,
              fundingRequestedCCBC2627: 5,
            },
          },
          lastEditedPage: 'projectFunding',
        },
      }
    );
  });

  it('Form is disabled when isEditable is false', () => {
    const mockFormDataIsEditableFalse = {
      ...mockQueryPayload,
      Application() {
        return {
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            id: 'TestFormId',
            jsonData: {},
            isEditable: false,
            updatedAt: '2022-09-12T14:04:10.790848-07:00',
          },
          status: 'draft',
        };
      },
    };
    componentTestingHelper.loadQuery(mockFormDataIsEditableFalse);
    componentTestingHelper.renderComponent();

    expect(
      screen.getByLabelText(
        'Provide a Project title. Be descriptive about the geographic region. Please refrain from using years in the title.'
      )
    ).toBeDisabled();
  });

  it('Button is continue when isEditable is false', () => {
    const mockFormDataIsEditableFalse = {
      ...mockQueryPayload,
      Application() {
        return {
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            id: 'TestFormId',
            jsonData: {},
            isEditable: false,
            updatedAt: '2022-09-12T14:04:10.790848-07:00',
          },
          status: 'draft',
        };
      },
    };
    componentTestingHelper.loadQuery(mockFormDataIsEditableFalse);
    componentTestingHelper.renderComponent();

    expect(
      screen.getByRole('button', { name: 'Continue' })
    ).toBeInTheDocument();
  });

  describe('the review page', () => {
    const REVIEW_PAGE_INDEX =
      uiSchema['ui:order'].findIndex((e) => e === 'review') + 1;

    // Tests for the Review theme that are shared with the review page and analyst application view
    sharedReviewThemeTests((payload) => {
      componentTestingHelper.loadQuery(payload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));
    });

    it('should not display alert box without errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(screen.getByText('All fields are complete')).toBeInTheDocument();
    });

    it('should display the alert box when there are errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByText(
          'There are empty fields in your application. Applications with unanswered fields may not be assessed.'
        )
      ).toBeInTheDocument();
    });

    it('allows continuing to the next page if there are no errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeEnabled();
    });

    it('prevents submission if errors are not acknowledged', async () => {
      componentTestingHelper.loadQuery(mockQueryPayload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeDisabled();

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeEnabled();
    });

    it('does not show the incomplete fields acknowledgment checkbox if there are no errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.queryByLabelText(
          /you acknowledge that there are incomplete fields and incomplete applications may not be assessed/i
        )
      ).toBeNull();
    });
  });

  it('can click to add more array field in the other funding sources section', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 6,
      query: data.query,
    }));

    const radioButton = screen.getByLabelText('Yes');

    await act(async () => {
      fireEvent.click(radioButton);
    });

    const addFundingSourceButton = screen.getByRole('button', {
      name: 'Add another funding source',
    });

    await act(async () => {
      fireEvent.click(addFundingSourceButton);
    });

    const removeButton = screen.getByRole('button', {
      name: 'Remove',
    });

    expect(removeButton).toBeInTheDocument();
  });
});
