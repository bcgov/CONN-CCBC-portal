import { withRelayOptions } from '../../pages';
import {screen} from '@testing-library/react'
import PageTestingHelper from '../utils/pageTestingHelper';
import Home from '../../pages/index';
import compiledPagesQuery,{ pagesQuery } from '__generated__/pagesQuery.graphql';

const mockQueryPayload = {
  Query() {
    return {
      session: {
        sub: '4e0ac88c-bf05-49ac-948f-7fd53c7a9fd6',
      },
      openIntake: {
        openTimestamp: '2022-08-17T12:51:26.69172-04:00',
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const pageTestingHelper = new PageTestingHelper<pagesQuery>({
  pageComponent: Home,
  compiledQuery: compiledPagesQuery,
  defaultQueryResolver: mockQueryPayload
})

describe('The index page', () => {
  it('does not redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/',
      },
    } as any;
    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });

  it('Displays open and close intake days', async () => {
    pageTestingHelper.loadQuery();
    pageTestingHelper.renderPage();
    
    expect(screen.getByText(/2022-08-17 at 09:51 AM \(PDT\)/i)).toBeInTheDocument();

    expect(screen.getByText(/2022-08-27 at 09:51 AM \(PDT\)/i)).toBeInTheDocument();
  })
});
