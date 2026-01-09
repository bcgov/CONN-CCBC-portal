const formatStatus = (status: string) => {
  if (status === 'Received') {
    return 'applicant_received';
  }
  if (status === 'Conditionally Approved') {
    return 'applicant_conditionally_approved';
  }
  if (status === 'Merged') {
    return 'applicant_merged';
  }
  return status;
};

// Normalize CBC status strings to equivalent applicant status codes
export const cbcProjectStatusConverter = (status?: string) => {
  if (!status) return status;
  if (status === 'Conditionally Approved') {
    return 'applicant_conditionally_approved';
  }
  if (status === 'Reporting Complete') {
    return 'complete';
  }
  if (status === 'Agreement Signed') {
    return 'applicant_approved';
  }
  if (status === 'Withdrawn') {
    return 'withdrawn';
  }
  return status;
};

export default formatStatus;
