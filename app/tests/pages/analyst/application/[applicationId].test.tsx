import { screen, within } from '@testing-library/react';
import mockFormData from 'tests/utils/mockFormData';
import { acknowledgementsEnum } from 'formSchema/pages/acknowledgements';
import sharedReviewThemeTests from 'tests/components/Review/ReviewTheme';
import PageTestingHelper from '../../../utils/pageTestingHelper';
import Application from '../../../../pages/analyst/application/[applicationId]';
import compiledApplicationIdQuery, {
  ApplicationIdQuery,
} from '../../../../__generated__/ApplicationIdQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      applicationByRowId: {
        formData: {
          jsonData: mockFormData,
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const mockEmptyFormDataPayload = {
  Query() {
    return {
      applicationByRowId: {
        formData: {
          jsonData: {},
        },
      },
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<ApplicationIdQuery>({
  pageComponent: Application,
  compiledQuery: compiledApplicationIdQuery,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {
    rowId: 1,
  },
});

describe('The analyst view application page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
    pageTestingHelper.setMockRouterValues({
      query: { applicationId: '1' },
    });
  });

  // Tests for the Review theme that are shared with the review page and analyst application view
  sharedReviewThemeTests((payload) => {
    pageTestingHelper.loadQuery(payload);
    pageTestingHelper.renderPage();
  });

  it('displays the correct nav links when user is logged in', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(
      screen.getByRole('heading', { name: 'Application' })
    ).toBeInTheDocument();
  });

  it('should have correct extra sections', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Acknowledgements' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Submission' })
    ).toBeInTheDocument();
  });

  it('should have the correct error in the Review section if form checkbox not checked', () => {
    pageTestingHelper.loadQuery(mockEmptyFormDataPayload);
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveStyle('background-color: rgba(248, 214, 203, 0.4)');
  });

  it('should have the correct value in the Review section if form checkbox is checked', () => {
    const payload = {
      Query() {
        return {
          applicationByRowId: {
            formData: {
              jsonData: {
                review: {
                  acknowledgeIncomplete: true,
                },
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

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section
        .getAllByText(
          'By checking this box, you acknowledge that there are incomplete fields and incomplete applications may not be assessed. If the incomplete fields are not applicable to you, please check the box and continue to the acknowledgements page.'
        )[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent('Yes');
  });

  it('should have the correct message in the Review section if form has no validation errors', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Review' }).closest('section')
    );

    expect(
      section.getByText('All mandatory fields are filled')
    ).toBeInTheDocument();
  });

  it('should have correct fields in Acknowledgements section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen
        .getByRole('heading', { name: 'Acknowledgements' })
        .closest('section')
    );

    for (let i = 0; i < acknowledgementsEnum.length; i += 1) {
      expect(
        section
          .getAllByText(acknowledgementsEnum[i])[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('Yes');
    }
  });

  it('should the correct fields in the Submission section', () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const section = within(
      screen.getByRole('heading', { name: 'Submission' }).closest('section')
    );

    expect(
      section
        .getAllByText('Completed for (Legal organization name)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedFor);

    expect(
      section
        .getAllByText('Completed by')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionCompletedBy);

    expect(
      section.getByText('Title').closest('tr').getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionTitle);

    expect(
      section
        .getAllByText('On this date (YYYY-MM-DD)')[0]
        .closest('tr')
        .getElementsByTagName('td')[0]
    ).toHaveTextContent(mockFormData.submission.submissionDate);
  });
});
