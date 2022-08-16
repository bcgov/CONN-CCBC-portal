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
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      formData: {},
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
    }),
  });

const acknowledgementsTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ApplicationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      pageNumber: 20,
    }),
  });

const submissionTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ApplicationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      pageNumber: 21,
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
          id: 'TestApplicationID',
          applicationPatch: {
            formData: { projectInformation: { projectTitle: 'test title' } },
            lastEditedPage: 'projectInformation',
          },
        },
      }
    );
  });

  it('sets lastEditedPage to the next page when the user clicks on "continue"', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'Save and continue' }));

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          id: 'TestApplicationID',
          applicationPatch: {
            formData: { projectInformation: {} },
            lastEditedPage: 'projectArea',
          },
        },
      }
    );
  });

  it('acknowledgement page continue is disabled on initial load', async () => {
    acknowledgementsTestingHelper.loadQuery();
    acknowledgementsTestingHelper.renderComponent();

    const continueButton = screen.getByRole('button', { name: 'Save and continue' });
    //node here is using the jest expect, whereas TS can only find the cypress jest
    expect(continueButton.hasAttribute('disabled')).toBeTrue();
  });

  it('acknowledgement page continue is enabled once all checkboxes have been clicked', async () => {
    acknowledgementsTestingHelper.loadQuery();
    acknowledgementsTestingHelper.renderComponent();

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

  it('submission page submit button is enabled on when all inputs filled', async () => {
    submissionTestingHelper.loadQuery();
    submissionTestingHelper.renderComponent();

    const completedFor = screen.getByLabelText(/Completed for/i);

    const onThisDate = screen.getByLabelText(/On this date/i);

    const completedBy = screen.getByLabelText(/Completed By/i);

    const title = screen.getByLabelText(/Title/i);

    fireEvent.change(completedFor, {
      value: 'Applicant Name',
    });

    fireEvent.change(onThisDate, {
      value: '2022-08-10',
    });

    fireEvent.change(completedBy, {
      value: 'Person Completed By',
    });

    userEvent.type(title, 'Mock Title').then(() => {
      waitFor(() =>
        expect(
          screen
            .getByRole('button', { name: 'Submit' })
            .hasAttribute('disabled')
        ).toBeFalse()
      );
    });
  });

  it('submission page submit button is enabled on when all inputs filled', async () => {
    submissionTestingHelper.loadQuery();
    submissionTestingHelper.renderComponent();

    expect(
      screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
    ).toBeTrue();
  });
});
