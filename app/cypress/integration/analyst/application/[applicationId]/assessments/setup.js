const assessmentsSetup = () => {
  cy.mockLogin('ccbc_analyst');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
};

export default assessmentsSetup;
