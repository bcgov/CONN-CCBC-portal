import { screen, within } from '@testing-library/react';
import Error500Page from 'pages/error-500';
import compilederror500Query, {
  error500Query,
} from '__generated__/error500Query.graphql';
import PageTestingHelper from '../utils/pageTestingHelper';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

jest.mock('@bcgov-cas/sso-express/dist/helpers');

const pageTestingHelper = new PageTestingHelper<error500Query>({
  pageComponent: Error500Page,
  compiledQuery: compilederror500Query,
  defaultQueryResolver: mockQueryPayload,
  defaultQueryVariables: {},
});

describe('The index page', () => {
  beforeEach(() => {
    pageTestingHelper.reinit();
  });

  it('displays the title', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText(`Uh oh, something went wrong`)).toBeVisible();
  });

  it('displays the return Home link', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    const p = screen.getByText(/Please return/).closest('p');

    expect(within(p).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
