const gisSetup = () => {
  cy.mockLogin('ccbc_admin');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_application_received');
  cy.intercept('POST', '/graphql').as('graphql');
  cy.intercept('GET', '*/features/*', {
    status: 200,
    features: {
      show_gis_upload: {
        defaultValue: true,
      },
    },
    dateUpdated: '2024-01-31T15:07:31.014Z',
  }).as('get-features');
};

export default gisSetup;
