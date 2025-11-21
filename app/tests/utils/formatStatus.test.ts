import formatStatus from '../../utils/formatStatus';

describe('The formatStatus function', () => {
  it('returns the correct status for Conditionally Approved', () => {
    expect(formatStatus('Conditionally Approved')).toBe(
      'applicant_conditionally_approved'
    );
  });

  it('returns the correct status for Received', () => {
    expect(formatStatus('Received')).toBe('applicant_received');
  });

  it('returns the correct status for Merged', () => {
    expect(formatStatus('Merged')).toBe('applicant_merged');
  });

  it('returns the correct unhandled status', () => {
    expect(formatStatus('unhandled_status')).toBe('unhandled_status');
  });
});
