import {
  isClaimsOpen,
  isCommunityProgressOpen,
  isMilestonesOpen,
  isConditionalApprovalComplete,
} from 'utils/projectAccordionValidators';

describe('The isConditionalApprovalComplete function', () => {
  it('returns the correct status for a completed Conditionally Approved form', () => {
    expect(
      isConditionalApprovalComplete({
        decision: {
          ministerDecision: 'Approved',
          ministerDate: '2023-09-01',
          ministerAnnouncement: 'Announce immediately',
          provincialRequested: 1,
        },
        isedDecisionObj: {
          isedDecision: 'Approved',
          isedDate: '2023-09-01',
          isedAnnouncement: 'Announce immediately',
          federalRequested: 1,
        },
        letterOfApproval: {
          letterOfApprovalDateSent: '2023-09-01',
          letterOfApprovalUpload: [
            {
              id: 1,
              uuid: '7fe732c7-7ec4-40e6-9cef-3fa29a96793e',
              name: 'file.xlsx',
              size: 2232925,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              uploadedAt: '2023-09-14T09:32:12.203-07:00',
            },
          ],
        },
        response: {
          applicantResponse: 'Accepted',
          statusApplicantSees: 'Conditionally Approved',
        },
      })
    ).toBe(true);
  });

  it('returns the correct status for an incomplete Conditionally Approved form', () => {
    expect(
      isConditionalApprovalComplete({
        decision: {
          ministerDecision: 'Approved',
          ministerDate: '2023-09-01',
          ministerAnnouncement: 'Announce immediately',
          provincialRequested: 1,
        },
      })
    ).toBe(false);
  });
});

describe('The isCommunityProgressOpen function', () => {
  it('returns the correct status for a project in the first quarter window', () => {
    expect(isCommunityProgressOpen('2021-03-01')).toBe(true);
    expect(isCommunityProgressOpen('2021-03-31')).toBe(true);
  });

  it('returns the correct status for a project in the second quarter window', () => {
    expect(isCommunityProgressOpen('2021-06-01')).toBe(true);
    expect(isCommunityProgressOpen('2021-06-30')).toBe(true);
  });

  it('returns the correct status for a project in the third quarter window', () => {
    expect(isCommunityProgressOpen('2021-09-01')).toBe(true);
    expect(isCommunityProgressOpen('2021-09-30')).toBe(true);
  });

  it('returns the correct status for a project in the fourth quarter window', () => {
    expect(isCommunityProgressOpen('2021-12-01')).toBe(true);
    expect(isCommunityProgressOpen('2021-12-31')).toBe(true);
  });

  it('returns the correct status for a project outside of the quarterly window', () => {
    expect(isCommunityProgressOpen('2021-01-01')).toBe(false);
    expect(isCommunityProgressOpen('2021-02-28')).toBe(false);
    expect(isCommunityProgressOpen('2021-04-01')).toBe(false);
    expect(isCommunityProgressOpen('2021-05-31')).toBe(false);
    expect(isCommunityProgressOpen('2021-07-01')).toBe(false);
    expect(isCommunityProgressOpen('2021-08-31')).toBe(false);
    expect(isCommunityProgressOpen('2021-10-01')).toBe(false);
    expect(isCommunityProgressOpen('2021-11-30')).toBe(false);
  });
});

describe('The isMilestonesOpen function', () => {
  it('returns the correct status for a project in the first quarter window', () => {
    expect(isMilestonesOpen('2021-03-15')).toBe(true);
    expect(isMilestonesOpen('2021-04-15')).toBe(true);
  });

  it('returns the correct status for a project in the second quarter window', () => {
    expect(isMilestonesOpen('2021-06-15')).toBe(true);
    expect(isMilestonesOpen('2021-07-15')).toBe(true);
  });

  it('returns the correct status for a project in the third quarter window', () => {
    expect(isMilestonesOpen('2021-09-15')).toBe(true);
    expect(isMilestonesOpen('2021-10-15')).toBe(true);
  });

  it('returns the correct status for a project in the fourth quarter window', () => {
    expect(isMilestonesOpen('2021-12-15')).toBe(true);
    expect(isMilestonesOpen('2022-01-15')).toBe(true);
  });

  it('returns the correct status for a project outside of the quarterly window', () => {
    expect(isMilestonesOpen('2021-02-28')).toBe(false);
    expect(isMilestonesOpen('2021-04-16')).toBe(false);
    expect(isMilestonesOpen('2021-05-31')).toBe(false);
    expect(isMilestonesOpen('2021-07-16')).toBe(false);
    expect(isMilestonesOpen('2021-08-31')).toBe(false);
    expect(isMilestonesOpen('2021-10-16')).toBe(false);
    expect(isMilestonesOpen('2021-11-30')).toBe(false);
    expect(isMilestonesOpen('2021-12-14')).toBe(false);
    expect(isMilestonesOpen('2022-01-16')).toBe(false);
  });
});

describe('The isClaimsOpen function', () => {
  it('returns the correct status for a project in the claims window', () => {
    expect(isClaimsOpen('2021-04-15')).toBe(true);
    expect(isClaimsOpen('2021-05-30')).toBe(true);
  });

  it('returns the correct status for a project outside of the claims window', () => {
    expect(isClaimsOpen('2021-04-14')).toBe(false);
    expect(isClaimsOpen('2021-05-31')).toBe(false);
  });
});
