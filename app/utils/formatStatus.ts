const formatStatus = (status: string) => {
  if (status === 'Received') {
    return 'applicant_received';
  }
  if (status === 'Conditionally Approved') {
    return 'applicant_conditionally_approved';
  }
  return status;
};

export default formatStatus;
