import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const testQuery = graphql`
  query ApplicationFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationID") {
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
      id: 'TestApplicationID',
      formData: {},
      status: 'draft',
      updatedAt: '2022-09-12T14:04:10.790848-07:00',
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

const submissionPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      status: 'draft',
      updatedAt: '2022-09-12T14:04:10.790848-07:00',
      formData: {
        organizationProfile: {
          organizationName: 'Testing organization name',
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
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              projectInformation: {
                projectTitle: 'test title',
              },
              submission: {
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectInformation',
          },
          id: 'TestApplicationID',
        },
      }
    );
  });

  it('sets lastEditedPage to the next page when the user clicks on "continue"', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save and continue' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              projectInformation: {},
              submission: {
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectArea',
          },
          id: 'TestApplicationID',
        },
      }
    );
  });

  it('auto fills the submission fields', async () => {
    const mockQueryAutofillPayload = {
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            organizationProfile: {
              organizationName: 'Test org',
            },
          },
          status: 'draft',
          updatedAt: '2022-09-12T14:04:10.790848-07:00',
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

    componentTestingHelper.loadQuery(mockQueryAutofillPayload);
    componentTestingHelper.renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save and continue' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              organizationProfile: {
                organizationName: 'Test org',
              },
              projectInformation: {},
              submission: {
                submissionCompletedFor: 'Test org',
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectArea',
          },
          id: 'TestApplicationID',
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

    const continueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    //node here is using the jest expect, whereas TS can only find the cypress jest
    expect(continueButton.hasAttribute('disabled')).toBeTrue();
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

    userEvent.click(lastCheckBox).then(() => {
      waitFor(() => {
        expect(
          screen
            .getByRole('button', { name: 'Save and continue' })
            .hasAttribute('disabled')
        ).toBeFalse();
      });
    });
  });

  it('displays the correct button label for withdrawn applications', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'withdrawn',
          formData: {},
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
    componentTestingHelper.renderComponent();

    expect(screen.getByRole('button', { name: 'Continue' }));
  });

  it('submission page submit button is enabled on when all inputs filled', async () => {
    componentTestingHelper.loadQuery(submissionPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    const completedBy = screen.getByLabelText(/Completed By/i);

    const title = screen.getByLabelText(/Title/i);

    fireEvent.change(completedBy, {
      value: 'Person Completed By',
    });

    userEvent.type(title, 'Mock Title').then(() => {
      expect(
        screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
      ).toBeFalse();
    });
  });

  it('submission page submit button is enabled on when all inputs filled', async () => {
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
    const formData = {
      submission: {
        submissionCompletedFor: 'Bob Loblaw',
        submissionDate: '2022-08-10',
        submissionCompletedBy: 'Bob Loblaw',
        submissionTitle: 'some title',
      },
    };
    componentTestingHelper.loadQuery({
      Application() {
        return {
          id: 'TestApplicationID',
          rowId: 42,
          formData,
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
      '/form/42/success'
    );
  });

  it('Submission page contains submission date from DB', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    // luxon renders this differently in test?
    expect(
      screen.getByText(/August 27, 2022, 9:51 a.m. PDT/)
    ).toBeInTheDocument();
  });

  it('Acknowledgement fields are disabled when visiting submitted application', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'submitted',
          formData: {},
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

  it('Submission fields are disabled when visiting submitted application', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'submitted',
          formData: {},
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
});
