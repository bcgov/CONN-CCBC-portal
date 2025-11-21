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

export default formatStatus;
