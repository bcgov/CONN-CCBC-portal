/**
 * @jest-environment node
 */

import { convertStatus } from '../../../../backend/lib/dashboard/util';

describe('Dashboard util functions', () => {
  it('should return "Withdrawn" for "analyst_withdrawn"', () => {
    expect(convertStatus('analyst_withdrawn')).toBe('Withdrawn');
  });

  it('should return "Agreement Signed" for "applicant_approved"', () => {
    expect(convertStatus('applicant_approved')).toBe('Agreement Signed');
  });

  it('should return "Cancelled" for "applicant_cancelled"', () => {
    expect(convertStatus('applicant_cancelled')).toBe('Cancelled');
  });

  it('should return "Closed" for "applicant_closed"', () => {
    expect(convertStatus('applicant_closed')).toBe('Closed');
  });

  it('should return "Complete" for "applicant_complete"', () => {
    expect(convertStatus('applicant_complete')).toBe('Complete');
  });

  it('should return "Conditionally Approved" for "applicant_conditionally_approved"', () => {
    expect(convertStatus('applicant_conditionally_approved')).toBe(
      'Conditionally Approved'
    );
  });

  it('should return "On Hold" for "applicant_on_hold"', () => {
    expect(convertStatus('applicant_on_hold')).toBe('On Hold');
  });

  it('should return "Received" for "applicant_received"', () => {
    expect(convertStatus('applicant_received')).toBe('Received');
  });

  it('should return "Assessment" for "assessment"', () => {
    expect(convertStatus('assessment')).toBe('Assessment');
  });

  it('should return "Cancelled" for "cancelled"', () => {
    expect(convertStatus('cancelled')).toBe('Cancelled');
  });

  it('should return "Received" for "received"', () => {
    expect(convertStatus('received')).toBe('Received');
  });

  it('should return "Submitted" for "submitted"', () => {
    expect(convertStatus('submitted')).toBe('Submitted');
  });

  it('should return "Withdrawn" for "withdrawn"', () => {
    expect(convertStatus('withdrawn')).toBe('Withdrawn');
  });

  it('should return "Conditionally Approved" for "conditionally_approved"', () => {
    expect(convertStatus('conditionally_approved')).toBe(
      'Conditionally Approved'
    );
  });

  it('should return "Approved" for "approved"', () => {
    expect(convertStatus('approved')).toBe('Approved');
  });

  it('should return "On Hold" for "on_hold"', () => {
    expect(convertStatus('on_hold')).toBe('On Hold');
  });

  it('should return "Closed" for "closed"', () => {
    expect(convertStatus('closed')).toBe('Closed');
  });

  it('should return "Recommendation" for "recommendation"', () => {
    expect(convertStatus('recommendation')).toBe('Recommendation');
  });

  it('should return "Complete" for "complete"', () => {
    expect(convertStatus('complete')).toBe('Complete');
  });

  it('should return the same status for unknown status', () => {
    expect(convertStatus('unknown_status')).toBe('unknown_status');
  });
});
