const testSetup = () => {
  cy.mockLogin('ccbc_admin');
  const mockedDateString = '2023-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
};

export default testSetup;
