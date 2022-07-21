import { withRelayOptions } from '../../../pages/form/[id]/success';

describe('The form/success page', () => {
  it('should redirect an unauthorized user', async () => {
    const ctx = {
      req: {
        url: '/form/success',
      },
    } as any;

    expect(await withRelayOptions.serverSideProps(ctx)).toEqual({
      redirect: {
        destination: '/',
      },
    });
  });
});
