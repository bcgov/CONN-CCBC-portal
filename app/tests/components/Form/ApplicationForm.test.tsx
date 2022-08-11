import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { fireEvent, screen } from '@testing-library/react';
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

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

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
});
