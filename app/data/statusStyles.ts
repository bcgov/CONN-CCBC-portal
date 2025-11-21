const statusStylesBase = {
  approved: {
    primary: '#FFFFFF',
    backgroundColor: '#1F8234',
    pillWidth: '188px',
    description: 'Agreement signed',
  },
  assessment: {
    primary: '#003366',
    backgroundColor: '#DBE6F0',
    pillWidth: '136px',
    description: 'Assessment',
  },
  cancelled: {
    primary: '#414141',
    backgroundColor: '#E8E8E8',
    pillWidth: '120px',
    description: 'Cancelled',
  },
  closed: {
    primary: '#414141',
    backgroundColor: '#E8E8E8',
    pillWidth: '140px',
    description: 'Not selected',
  },
  complete: {
    primary: '#003366',
    backgroundColor: '#DBE6F0',
    pillWidth: '200px',
    description: 'Reporting complete',
  },
  conditionally_approved: {
    primary: '#FFFFFF',
    backgroundColor: '#1F8234',
    pillWidth: '222px',
    description: 'Conditionally approved',
  },
  merged: {
    primary: '#FFFFFF',
    backgroundColor: '#8250DF',
    pillWidth: '140px',
    description: 'Merged',
  },
  applicant_conditionally_approved: {
    primary: '#FFFFFF',
    backgroundColor: '#1F8234',
    pillWidth: '212px',
    description: 'Conditionally approved',
  },
  on_hold: {
    primary: '#A37000',
    backgroundColor: '#FFECC2',
    pillWidth: '106px',
    description: 'On hold',
  },
  received: {
    primary: '#FFFFFF',
    backgroundColor: '#345FA9',
    pillWidth: '116px',
    description: 'Received',
  },
  applicant_received: {
    primary: '#FFFFFF',
    backgroundColor: '#345FA9',
    pillWidth: '116px',
    description: 'Received',
  },
  recommendation: {
    primary: '#003366',
    backgroundColor: '#DBE6F0',
    pillWidth: '180px',
    description: 'Recommendation',
  },
  screening: {
    primary: '#003366',
    backgroundColor: '#DBE6F0',
    pillWidth: '120px',
    description: 'Screening',
  },
  withdrawn: {
    primary: '#414141',
    backgroundColor: '#E8E8E8',
    pillWidth: '128px',
    description: 'Withdrawn',
  },
  draft: {
    description: 'Draft',
    backgroundColor: '#606060E6',
    primary: '#FFFFFF',
    pillWidth: '116px',
  },
  submitted: {
    pillWidth: '116px',
    primary: '#FFFFFF',
    backgroundColor: '#1A5A96',
    description: 'Submitted',
  },
};

// Spread base styles for applicant status styles
const statusStyles = {
  ...statusStylesBase,
  analyst_withdrawn: {
    ...statusStylesBase.withdrawn,
  },
  applicant_approved: {
    ...statusStylesBase.approved,
  },
  applicant_assessment: {
    ...statusStylesBase.assessment,
  },
  applicant_cancelled: {
    ...statusStylesBase.cancelled,
  },
  applicant_closed: {
    ...statusStylesBase.closed,
  },
  applicant_complete: {
    ...statusStylesBase.complete,
  },
  applicant_conditionally_approved: {
    ...statusStylesBase.conditionally_approved,
  },
  applicant_merged: {
    ...statusStylesBase.merged,
  },
  applicant_on_hold: {
    ...statusStylesBase.on_hold,
  },
  applicant_received: {
    ...statusStylesBase.received,
  },
  applicant_recommendation: {
    ...statusStylesBase.recommendation,
  },
  applicant_screening: {
    ...statusStylesBase.screening,
  },
  applicant_withdrawn: {
    ...statusStylesBase.withdrawn,
  },
  applicant_draft: {
    ...statusStylesBase.draft,
  },
  applicant_submitted: {
    ...statusStylesBase.submitted,
  },
};

export default statusStyles;
