const rfiSetup = () => {
  cy.mockLogin('ccbc_analyst');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
  cy.intercept('POST', '/graphql').as('graphql');
};

const rfiSetupCcbcAdmin = () => {
  cy.mockLogin('ccbc_admin');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
  cy.intercept('POST', '/graphql').as('graphql');
};

const rfiSetupCbcAdmin = () => {
  cy.mockLogin('cbc_admin');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
  cy.intercept('POST', '/graphql').as('graphql');
};

const rfiSetupSuperAdmin = () => {
  cy.mockLogin('super_admin');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_analyst');
  cy.intercept('POST', '/graphql').as('graphql');
};

export { rfiSetupCcbcAdmin, rfiSetupCbcAdmin, rfiSetupSuperAdmin, rfiSetup };
