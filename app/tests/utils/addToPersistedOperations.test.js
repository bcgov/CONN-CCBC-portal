import { addToPersistedOperations } from '../../utils/addToPersistedOperations';

describe('The addToPersistedOperations function', () => {
  it('completes the operation', async () => {
    expect(await addToPersistedOperations()).toEqual('Finished');
  });
});
