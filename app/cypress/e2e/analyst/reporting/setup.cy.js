// const gcpeSetup = () => {
//   cy.mockLogin('cbc_admin');

//   const mockedDate = new Date('2024-01-15T12:00:00-08:00');
//   cy.useMockedTime(mockedDate);

//   [
//     'e2e/reset_db_all',
//     'e2e/001_intake',
//     'e2e/001_cbc_project',
//     'e2e/001_application_summary_with_milestones',
//     'e2e/001_gcpe_reports',
//   ].forEach((fixture) => {
//     cy.sqlFixture(fixture);
//   });
// };

// export default gcpeSetup;

const gcpeSetup = () => {
  cy.mockLogin('ccbc_admin');
  const mockedDateString = '2022-10-10';
  const mockedDate = new Date(mockedDateString);
  cy.useMockedTime(mockedDate);
  cy.sqlFixture('e2e/reset_db_all');
  cy.sqlFixture('e2e/001_intake');
  cy.sqlFixture('e2e/001_application');
  cy.sqlFixture('e2e/001_cbc_project');
  cy.sqlFixture('e2e/001_application_received');
  cy.sqlFixture('e2e/001_gcpe_reports');
};

export default gcpeSetup;
