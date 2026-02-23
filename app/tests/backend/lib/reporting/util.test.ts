/**
 * @jest-environment node
 */

import { DateTime } from 'luxon';
import {
  buildStatusTransition,
  compareAndMarkArrays,
  convertStatus,
} from 'backend/lib/reporting/util';

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

  it('should return "Reporting Complete" for "complete"', () => {
    expect(convertStatus('complete')).toBe('Reporting Complete');
  });

  it('should return "Withdrawn" for "withdrawn"', () => {
    expect(convertStatus('withdrawn')).toBe('Withdrawn');
  });

  it.each([
    ['applicant_merged', 'Merged'],
    ['applicant_conditionally_approved', 'Conditionally Approved'],
    ['applicant_complete', 'Reporting Complete'],
    ['applicant_withdrawn', 'Withdrawn'],
  ])('should return "%s" as "%s"', (input, expected) => {
    expect(convertStatus(input)).toBe(expected);
  });

  describe('buildStatusTransition', () => {
    const node = (
      status: string,
      visibleByApplicant: boolean,
      description?: string
    ) => ({
      status,
      applicationStatusTypeByStatus: { visibleByApplicant, description },
    });

    it('returns "Unknown" for empty statusNodes', () => {
      expect(buildStatusTransition([])).toBe('Unknown');
    });

    it('returns "Unknown" when all statuses are filtered out', () => {
      const nodes = [
        node('draft', true, 'Draft'),
        node('submitted', true, 'Submitted'),
      ];
      expect(buildStatusTransition(nodes)).toBe('Unknown');
    });

    it('filters out draft and submitted statuses', () => {
      const nodes = [
        node('draft', true, 'Draft'),
        node('submitted', true, 'Submitted'),
        node('screening', false, 'Screening'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes)).toBe(
        'Screening --> Agreement Signed'
      );
    });

    it('filters out visibleByApplicant statuses', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('approved', false, 'Agreement Signed'),
        node('applicant_approved', true, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes)).toBe(
        'Screening --> Agreement Signed'
      );
    });

    it('uses description when available', () => {
      const nodes = [
        node('approved', false, 'Custom Description'),
      ];
      expect(buildStatusTransition(nodes)).toBe('Custom Description');
    });

    it('falls back to convertStatus when description is missing', () => {
      const nodes = [
        { status: 'approved', applicationStatusTypeByStatus: { visibleByApplicant: false } },
      ];
      expect(buildStatusTransition(nodes)).toBe('Agreement Signed');
    });

    it('deduplicates consecutive identical descriptions', () => {
      const nodes = [
        node('conditionally_approved', false, 'Conditionally Approved'),
        node('applicant_conditionally_approved', false, 'Conditionally Approved'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes)).toBe(
        'Conditionally Approved --> Agreement Signed'
      );
    });

    it('shows full transition when no fromStatus is provided', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('assessment', false, 'Assessment'),
        node('recommendation', false, 'Recommendation'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes)).toBe(
        'Screening --> Assessment --> Recommendation --> Agreement Signed'
      );
    });

    it('starts from fromStatus when it matches by description', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('assessment', false, 'Assessment'),
        node('recommendation', false, 'Recommendation'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes, 'Assessment')).toBe(
        'Assessment --> Recommendation --> Agreement Signed'
      );
    });

    it('starts from fromStatus when it matches by convertStatus', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('conditionally_approved', false, undefined),
        node('approved', false, undefined),
      ];
      expect(buildStatusTransition(nodes, 'Conditionally Approved')).toBe(
        'Conditionally Approved --> Agreement Signed'
      );
    });

    it('uses last matching index when fromStatus appears multiple times', () => {
      const nodes = [
        node('on_hold', false, 'On Hold'),
        node('screening', false, 'Screening'),
        node('on_hold', false, 'On Hold'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes, 'On Hold')).toBe(
        'On Hold --> Agreement Signed'
      );
    });

    it('starts from beginning when fromStatus is not found', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes, 'Nonexistent Status')).toBe(
        'Screening --> Agreement Signed'
      );
    });

    it('matches fromStatus case-insensitively', () => {
      const nodes = [
        node('screening', false, 'Screening'),
        node('assessment', false, 'Assessment'),
        node('approved', false, 'Agreement Signed'),
      ];
      expect(buildStatusTransition(nodes, 'assessment')).toBe(
        'Assessment --> Agreement Signed'
      );
    });

    it('handles a realistic full status history', () => {
      const nodes = [
        node('draft', true, 'Draft'),
        node('submitted', true, 'Submitted'),
        node('received', true, 'Received'),
        node('screening', false, 'Screening'),
        node('assessment', false, 'Assessment'),
        node('conditionally_approved', false, 'Conditionally Approved'),
        node('applicant_conditionally_approved', true, 'Conditionally Approved'),
        node('approved', false, 'Agreement signed'),
        node('applicant_approved', true, 'Agreement signed'),
      ];
      expect(buildStatusTransition(nodes)).toBe(
        'Screening --> Assessment --> Conditionally Approved --> Agreement signed'
      );
    });

    it('handles a realistic transition from a previous status', () => {
      const nodes = [
        node('draft', true, 'Draft'),
        node('submitted', true, 'Submitted'),
        node('received', true, 'Received'),
        node('screening', false, 'Screening'),
        node('assessment', false, 'Assessment'),
        node('conditionally_approved', false, 'Conditionally Approved'),
        node('applicant_conditionally_approved', true, 'Conditionally Approved'),
        node('approved', false, 'Agreement signed'),
        node('applicant_approved', true, 'Agreement signed'),
      ];
      expect(buildStatusTransition(nodes, 'Conditionally Approved')).toBe(
        'Agreement signed'
      );
    });
  });

  describe('compareAndMarkArrays percentage normalization', () => {
    const headerRow = [
      { value: 'Col0' },
      { value: 'Col1' },
      { value: 'Col2' },
      { value: 'Col3' },
      { value: 'Col4' },
      { value: 'Project #' },
      { value: '% Project Milestone Complete' },
      { value: 'Changelog' },
    ];

    const buildRow = (id: string, percentValue: string) => [
      { value: 'v0' },
      { value: 'v1' },
      { value: 'v2' },
      { value: 'v3' },
      { value: 'v4' },
      { value: id },
      { value: percentValue },
      { value: '' },
    ];

    it('treats "13%" and "0.13" as equivalent', () => {
      const array1 = [headerRow, buildRow('ID1', '13%')];
      const array2 = [headerRow, buildRow('ID1', '0.13')];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][6].backgroundColor).toBeUndefined();
      expect(result[1][7].value).toBe(' ');
    });

    it('marks changes when normalized percentage differs', () => {
      const array1 = [headerRow, buildRow('ID1', '13%')];
      const array2 = [headerRow, buildRow('ID1', '0.12')];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][6].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].value).toContain('% Project Milestone Complete');
    });
  });

  describe('compareAndMarkArrays new record handling', () => {
    const headerRow = [
      { value: 'Program' },
      { value: 'Col1' },
      { value: 'Col2' },
      { value: 'Col3' },
      { value: 'Col4' },
      { value: 'Project #' },
      { value: 'Status' },
      { value: 'Change log' },
    ];

    const buildRow = (
      program: string,
      id: string,
      status: string,
      statusNodes?: any[]
    ) => [
      { value: program },
      { value: 'v1' },
      { value: 'v2' },
      { value: 'v3' },
      { value: 'v4' },
      { value: id },
      { value: status, statusNodes },
      { value: '' },
    ];

    it('highlights and logs new CBC records', () => {
      const array1 = [headerRow, buildRow('CBC', 'ID1', 'Reporting Complete')];
      const array2 = [headerRow];
      const createdAt = '2024-01-02T03:04:05.000Z';
      const expectedTimestamp = DateTime.fromISO(createdAt)
        .setZone('America/Los_Angeles')
        .toLocaleString(DateTime.DATETIME_FULL);

      const result = compareAndMarkArrays(array1, array2, {
        cbcCreatedAtByProjectNumber: new Map([['ID1', createdAt]]),
      });

      expect(result[1][0].backgroundColor).toBe('#2FA7DD');
      expect(result[1][6].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].value).toBe(
        `New record added to Connectivity Portal on ${expectedTimestamp}`
      );
    });

    it('highlights and logs new CCBC records with status history', () => {
      const array1 = [
        headerRow,
        buildRow('CCBC', 'ID2', 'Agreement Signed', [
          {
            status: 'conditionally_approved',
            applicationStatusTypeByStatus: { visibleByApplicant: false },
          },
          {
            status: 'approved',
            applicationStatusTypeByStatus: { visibleByApplicant: false },
          },
        ]),
      ];
      const array2 = [headerRow];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][0].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].value).toBe(
        'Record added to GCPE list due to status change: Conditionally Approved --> Agreement Signed'
      );
      expect(result[1][7].backgroundColor).toBe('#2FA7DD');
    });
  });

  describe('compareAndMarkArrays changelog highlighting', () => {
    const headerRow = [
      { value: 'Program' },
      { value: 'Col1' },
      { value: 'Col2' },
      { value: 'Col3' },
      { value: 'Col4' },
      { value: 'Project #' },
      { value: 'Status' },
      { value: 'Change log' },
    ];

    const buildRow = (program: string, id: string, status: string) => [
      { value: program },
      { value: 'v1' },
      { value: 'v2' },
      { value: 'v3' },
      { value: 'v4' },
      { value: id },
      { value: status },
      { value: '' },
    ];

    it('applies blue background to changelog cell when changes exist', () => {
      const array1 = [headerRow, buildRow('CCBC', 'ID1', 'On Hold')];
      const array2 = [headerRow, buildRow('CCBC', 'ID1', 'Approved')];

      const result = compareAndMarkArrays(array1, array2);

      expect(result[1][6].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].backgroundColor).toBe('#2FA7DD');
      expect(result[1][7].value).toContain('Status');
    });
  });
});
