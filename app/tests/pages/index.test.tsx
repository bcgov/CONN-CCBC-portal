import { withRelayOptions } from '../../pages';
import { screen } from '@testing-library/react';
import PageTestingHelper from '../utils/pageTestingHelper';
import Home from '../../pages/index';
import compiledPagesQuery, {
  pagesQuery,
} from '__generated__/pagesQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<pagesQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload,
});

describe('The index page', () => {
  it('does not redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('Displays the Go to dashboard button for a logged in user', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();

    expect(screen.getByText('Go to dashboard')).toBeInTheDocument();
  });
});
