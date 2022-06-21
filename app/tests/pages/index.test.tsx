import { withRelayOptions } from '../../pages';

describe('The index page', () => {
  it('does not redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/',
      },
    } as any;
    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({});
  });
});
