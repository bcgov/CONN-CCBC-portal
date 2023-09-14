import { DateTime } from 'luxon';

const isConditionalApprovalComplete = (data) => {
  const ministerAnnouncement = data?.decision?.ministerAnnouncement;
  const ministerDate = data?.decision?.ministerDate;
  const ministerDecision = data?.decision?.ministerDecision;
  const provincialRequested = data?.decision?.provincialRequested;
  const federalRequested = data?.isedDecisionObj?.federalRequested;
  const isedAnnouncement = data?.isedDecisionObj?.isedAnnouncement;
  const isedDate = data?.isedDecisionObj?.isedDate;
  const isedDecision = data?.isedDecisionObj?.isedDecision;
  const letterOfApprovalDateSent =
    data?.letterOfApproval?.letterOfApprovalDateSent;
  const letterOfApprovalUpload = data?.letterOfApproval?.letterOfApprovalUpload;
  const applicantResponse = data?.response?.applicantResponse;
  const statusApplicantSees = data?.response?.statusApplicantSees;

  const isComplete =
    ministerAnnouncement &&
    ministerDate &&
    ministerDecision &&
    provincialRequested &&
    federalRequested &&
    isedAnnouncement &&
    isedDate &&
    isedDecision &&
    letterOfApprovalDateSent &&
    letterOfApprovalUpload?.length > 0 &&
    applicantResponse &&
    statusApplicantSees;

  if (isComplete) {
    return true;
  }
  return false;
};

const isCommunityProgressOpen = (date) => {
  const newDate = new Date(new Date(date).toDateString());

  const today = DateTime.fromJSDate(newDate, { zone: 'UTC' });
  const { year } = today;
  const firstQuarterStart = DateTime.fromISO(`${year}-03-01`);

  const firstQuarterEnd = DateTime.fromISO(`${year}-03-31`);

  const secondQuarterStart = DateTime.fromISO(`${year}-06-01`);
  const secondQuarterEnd = DateTime.fromISO(`${year}-06-30`);

  const thirdQuarterStart = DateTime.fromISO(`${year}-09-01`);
  const thirdQuarterEnd = DateTime.fromISO(`${year}-09-30`);

  const fourthQuarterStart = DateTime.fromISO(`${year}-12-01`);
  const fourthQuarterEnd = DateTime.fromISO(`${year}-12-31`);

  if (
    (today >= firstQuarterStart && today <= firstQuarterEnd) ||
    (today >= secondQuarterStart && today <= secondQuarterEnd) ||
    (today >= thirdQuarterStart && today <= thirdQuarterEnd) ||
    (today >= fourthQuarterStart && today <= fourthQuarterEnd)
  ) {
    return true;
  }
  return false;
};

const isMilestonesOpen = (date) => {
  const newDate = new Date(new Date(date).toDateString());

  const today = DateTime.fromJSDate(newDate, { zone: 'UTC' });
  const { year } = today;

  const firstQuarterStart = DateTime.fromISO(`${year}-03-15`);
  const firstQuarterEnd = DateTime.fromISO(`${year}-04-15`);

  const secondQuarterStart = DateTime.fromISO(`${year}-06-15`);
  const secondQuarterEnd = DateTime.fromISO(`${year}-07-15`);

  const thirdQuarterStart = DateTime.fromISO(`${year}-09-15`);
  const thirdQuarterEnd = DateTime.fromISO(`${year}-10-15`);

  const fourthQuarterStart = DateTime.fromISO(`${year}-12-15`);
  const fourthQuarterEnd = DateTime.fromISO(`${year + 1}-01-15`);

  if (
    (today >= firstQuarterStart && today <= firstQuarterEnd) ||
    (today >= secondQuarterStart && today <= secondQuarterEnd) ||
    (today >= thirdQuarterStart && today <= thirdQuarterEnd) ||
    (today >= fourthQuarterStart && today <= fourthQuarterEnd)
  ) {
    return true;
  }
  return false;
};

const isClaimsOpen = (date) => {
  const newDate = new Date(new Date(date).toDateString());

  const today = DateTime.fromJSDate(newDate, { zone: 'UTC' });
  const { year } = today;

  const openStartDate = DateTime.fromISO(`${year}-04-15`);
  const openEndDate = DateTime.fromISO(`${year}-05-30`);

  if (today >= openStartDate && today <= openEndDate) {
    return true;
  }
  return false;
};

export {
  isClaimsOpen,
  isCommunityProgressOpen,
  isMilestonesOpen,
  isConditionalApprovalComplete,
};
