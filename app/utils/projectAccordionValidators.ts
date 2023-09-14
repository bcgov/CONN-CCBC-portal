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
  if (!date) return false;

  const today = Date.parse(date);
  const currentDateTime = DateTime.fromJSDate(new Date(date));
  const { year } = currentDateTime;

  const firstQuarterStart = Date.parse(`${year}-03-01`);

  const firstQuarterEnd = Date.parse(`${year}-03-31`);

  const secondQuarterStart = Date.parse(`${year}-06-01`);
  const secondQuarterEnd = Date.parse(`${year}-06-30`);

  const thirdQuarterStart = Date.parse(`${year}-09-01`);
  const thirdQuarterEnd = Date.parse(`${year}-09-30`);

  const fourthQuarterStart = Date.parse(`${year}-12-01`);
  const fourthQuarterEnd = Date.parse(`${year}-12-31`);

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
  if (!date) return false;

  const today = Date.parse(date);
  const currentDateTime = DateTime.fromJSDate(new Date(date)).toUTC();
  const { day, month, year } = currentDateTime;

  const firstQuarterStart = Date.parse(`${year}-03-15`);
  const firstQuarterEnd = Date.parse(`${year}-04-15`);

  const secondQuarterStart = Date.parse(`${year}-06-15`);
  const secondQuarterEnd = Date.parse(`${year}-07-15`);

  const thirdQuarterStart = Date.parse(`${year}-09-15`);
  const thirdQuarterEnd = Date.parse(`${year}-10-15`);

  let fourthQuarterStart = Date.parse(`${year}-12-15`);
  let fourthQuarterEnd = Date.parse(`${year + 1}-01-15`);

  // If the date is in January, we need to adjust the year to be the previous year
  if (month === 1 && day <= 15) {
    fourthQuarterStart = Date.parse(`${year - 1}-12-15`);
    fourthQuarterEnd = Date.parse(`${year}-01-15`);
  }

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
  if (!date) return false;

  const today = Date.parse(date);
  const currentDateTime = DateTime.fromJSDate(new Date(date));
  const { year } = currentDateTime;

  const openStartDate = Date.parse(`${year}-04-15`);
  const openEndDate = Date.parse(`${year}-05-30`);

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
