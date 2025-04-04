/**
 * @jest-environment node
 */

import { convertStatus } from 'backend/lib/reporting/util';

describe('Dashboard util functions', () => {
  it('should return "Conditionally Approved" for "conditionally_approved"', () => {
    expect(convertStatus('conditionally_approved')).toBe(
      'Conditionally Approved'
    );
  });

  it('should return "Agreement Signed" for "approved"', () => {
    expect(convertStatus('approved')).toBe('Agreement Signed');
  });

  it('should return "On Hold" for "on_hold"', () => {
    expect(convertStatus('on_hold')).toBe('On Hold');
  });

  it('should return "Not selected" for "closed"', () => {
    expect(convertStatus('closed')).toBe('Not selected');
  });

  it('should return "Recommendation" for "recommendation"', () => {
    expect(convertStatus('recommendation')).toBe('Recommendation');
  });

  it('should return "Complete" for "complete"', () => {
    expect(convertStatus('complete')).toBe('Complete');
  });
});
