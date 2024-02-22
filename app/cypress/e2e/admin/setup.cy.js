const testSetup = () => {
  cy.mockLogin('ccbc_admin');
  const mockedDateString = '2023-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  const now = new Date(Date.parse('2024-01-15')).getTime();
  cy.clock(now, ['Date']);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
  cy.intercept('POST', '/graphql').as('graphql');
};

export default testSetup;
