import { graphql } from 'react-relay';
import compiledQuery, {
  ApplicationFormStatusTestQuery,
} from '__generated__/ApplicationFormStatusTestQuery.graphql';
import { screen } from '@testing-library/react';
import { Settings, DateTime } from 'luxon';
import ApplicationFormStatus from 'components/Form/ApplicationFormStatus';
import ComponentTestingHelper from '../../utils/componentTestingHelper';

const testQuery = graphql`
  query ApplicationFormStatusTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationID") {
      ...ApplicationFormStatus_application
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      formData: {
        updatedAt: DateTime.local(2020, 1, 1, 4, 42).toISO(),
      },
      projectName: 'test title',
      status: 'draft',
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormStatusTestQuery>({
    component: ApplicationFormStatus,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      isSaving: false,
    }),
  });

describe('The application form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('displays  the saved time when it was saved on the same day', () => {
    const mockCurrentTime = DateTime.local(2020, 1, 1, 5, {
      zone: 'America/Vancouver',
    });
    Settings.now = () => mockCurrentTime.toMillis();

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Saving')).toBeNull();
    expect(screen.getByText('Last saved: 04:42')).toBeInTheDocument();
  });

  it('displays the saved date when it was saved on a different day', () => {
    const mockCurrentTime = DateTime.local(2020, 1, 2, 0, {
      zone: 'America/Vancouver',
    });
    Settings.now = () => mockCurrentTime.toMillis();

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    expect(screen.queryByText('Saving')).toBeNull();
    expect(screen.getByText('Last saved: Jan 1')).toBeInTheDocument();
  });

  it('displays the error message if provided', () => {
    const mockCurrentTime = DateTime.local(2020, 1, 2, 0, {
      zone: 'America/Vancouver',
    });
    Settings.now = () => mockCurrentTime.toMillis();

    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      error: 'uh-oh',
    }));

    expect(screen.getByText('uh-oh')).toBeInTheDocument();
  });

  it('displays a "saving" message when isSaving is true', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      isSaving: true,
    }));

    expect(screen.getByText('Saving')).toBeInTheDocument();
  });
});
