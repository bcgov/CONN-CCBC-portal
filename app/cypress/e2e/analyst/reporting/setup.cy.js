const reportingSetup = (role = 'ccbc_admin') => {
  cy.mockLogin(role);
  const mockedDateString = '2024-06-30';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db_all');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_received_applications');
  cy.sqlFixture('e2e/001_cbc_project');
  cy.sqlFixture('e2e/001_analyst');
  cy.sqlFixture('e2e/001_gcpe_reports');
};

export default reportingSetup;
