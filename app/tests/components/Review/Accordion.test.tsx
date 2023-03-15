import { getToggledState } from '../../../components/Review/Accordion';

describe('getToggledState', () => {
  it('returns defaultToggle when toggled is null', () => {
    const result = getToggledState(null, true);
    expect(result).toEqual(true);
  });

  it('returns defaultToggle when toggled is undefined', () => {
    const result = getToggledState(undefined, false);
    expect(result).toEqual(false);
  });

  it('returns toggled when toggled is true', () => {
    const result = getToggledState(true, false);
    expect(result).toEqual(true);
  });

  it('returns toggled when toggled is false', () => {
    const result = getToggledState(false, true);
    expect(result).toEqual(false);
  });
});
