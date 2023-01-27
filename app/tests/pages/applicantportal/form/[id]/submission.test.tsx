import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';
import { schema } from 'formSchema';
import ComponentTestingHelper from 'tests/utils/componentTestingHelper';

const testQuery = graphql`
  query submissionFormPageTestQuery @relay_test_operation {
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
      intakeByIntakeId: {
        closeTimestamp: null,
      },
      status: 'draft',
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

const submissionPayload = {
  Application() {
    return {
      status: 'draft',
      formData: {
        id: 'TestFormId',
        isEditable: true,
        updatedAt: '2022-09-12T14:04:10.790848-07:00',
        formByFormSchemaId: {
          jsonSchema: schema,
        },
        jsonData: {
          organizationProfile: {
            organizationName: 'Testing organization name',
          },
          submission: {
            submissionCompletedFor: 'test',
            submissionDate: '2022-09-27',
            submissionCompletedBy: 'test',
            submissionTitle: 'test',
          },
          acknowledgements: {
            acknowledgementsList: acknowledgementsEnum,
          },
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

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ApplicationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }),
  });

describe('The submission form page', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('Submission page displays the open intake date when there is an open intake and has not been submitted', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByText(/August 27, 2022, 9:52:00 a.m. PDT./)
    ).toBeInTheDocument();
  });

  it('Submission page displays the intakeByIntakeId intake date when there is no open intake and the application has been submitted', async () => {
    const submissionIntakeTimePayload = {
      Application() {
        return {
          status: 'submitted',
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {},
          },
          intakeByIntakeId: {
            closeTimestamp: '2023-08-27T12:59:00.00000-04:00',
          },
        };
      },
      Query() {
        return {};
      },
    };

    componentTestingHelper.loadQuery(submissionIntakeTimePayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByText(/August 27, 2023, 9:59:00 a.m. PDT./)
    ).toBeInTheDocument();
  });

  it('Submission page does not display the time when there is no open intake or intakeByIntakeId date', async () => {
    const submissionIntakeTimePayload = {
      Application() {
        return {
          status: 'submitted',
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            jsonData: {},
          },
          intakeByIntakeId: {
            closeTimestamp: null,
          },
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: null,
          },
        };
      },
    };

    componentTestingHelper.loadQuery(submissionIntakeTimePayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByText(
        'Certify that you have the authority to submit this information on behalf of the Applicant. After submission, you can continue to edit this application until the intake closes.'
      )
    ).toBeInTheDocument();
  });

  it('submission page submit button is enabled on when all inputs filled', () => {
    componentTestingHelper.loadQuery(submissionPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
    ).toBeFalse();
  });

  it('submission page submit button is disabled on when all fields are not filled', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
    ).toBeTrue();
  });

  it('waits for the mutations to be completed before redirecting to the success page', async () => {
    const jsonData = {
      submission: {
        submissionCompletedFor: 'Bob Loblaw',
        submissionDate: '2022-08-10',
        submissionCompletedBy: 'Bob Loblaw',
        submissionTitle: 'some title',
      },
      acknowledgements: {
        acknowledgementsList: acknowledgementsEnum,
      },
    };
    componentTestingHelper.loadQuery({
      Application() {
        return {
          id: 'TestApplicationId',
          rowId: 42,
          formData: {
            formByFormSchemaId: {
              jsonSchema: schema,
            },
            id: 'TestFormId',
            jsonData,
            isEditable: true,
          },
        };
      },
    });
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // After the first mutation completes, we still don't redirect
    expect(componentTestingHelper.router.push).not.toHaveBeenCalled();

    componentTestingHelper.expectMutationToBeCalled(
      'submitApplicationMutation',
      {
        input: {
          applicationRowId: 42,
        },
      }
    );

    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      data: {
        applicationsAddCcbcId: {
          application: {
            ccbcNumber: 'CCBC-010042',
            status: 'submitted',
          },
        },
      },
    });

    // We only redirect when the ccbc id is set
    expect(componentTestingHelper.router.push).toHaveBeenCalledWith(
      '/applicantportal/form/42/success'
    );
  });

  it('Submission fields are disabled when visiting submitted application', async () => {
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
      pageNumber: 21,
      query: data.query,
    }));

    const textBoxes = screen.getAllByRole('textbox');

    textBoxes.forEach((textBox) => {
      expect(textBox.hasAttribute('disabled')).toBeTrue();
    });
  });

  it('saves the form when the Save as draft button is clicked', async () => {
    componentTestingHelper.loadQuery(submissionPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    await userEvent.click(
      screen.getByRole('button', { name: 'Save as draft' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationFormMutation',
      {
        input: {
          formDataRowId: 42,
          jsonData: {
            organizationProfile: {
              organizationName: 'Testing organization name',
            },
            submission: {
              submissionCompletedFor: 'test',
              submissionDate: '2022-09-27',
              submissionCompletedBy: 'test',
              submissionTitle: 'test',
            },
            acknowledgements: { acknowledgementsList: acknowledgementsEnum },
          },
          lastEditedPage: 'review',
        },
      }
    );
  });

  it('submit page submit button is disabled for submitted application', async () => {
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
            isEditable: true,
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
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Changes submitted' })
    ).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Changes submitted' })
        .hasAttribute('disabled')
    ).toBeTrue();
  });

  it('submit page has functioning return to dashboard button for submitted application', async () => {
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
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Return to dashboard' })
    ).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Return to dashboard' })
    );

    expect(componentTestingHelper.router.push).toHaveBeenCalledWith(
      '/applicantportal/dashboard'
    );
  });

  it('submit button is disabled when isEditable is false', () => {
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
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('return to dashboard is visible when isEditable is false', () => {
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
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Return to dashboard' })
    ).toBeInTheDocument();
  });
});
