describe('The analyst dashboard', () => {
  // eslint-disable-next-line prefer-arrow-callback, func-names
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db_all');
    cy.sqlFixture('e2e/001_intake');
    cy.sqlFixture('e2e/001_received_applications');
    cy.sqlFixture('e2e/001_cbc_project');
    cy.sqlFixture('e2e/001_analyst');
    cy.mockLogin('ccbc_analyst');
  });

  it('loads', () => {
    cy.visit('/analyst/dashboard');
    cy.contains('a', 'Dashboard');
    cy.get('body').happoScreenshot({ component: 'Analyst Dashboard' });
  });

  it('click on dashboard row', () => {
    cy.visit('/analyst/dashboard');
    // need to add to prevent "is detached from the dom" issue
    cy.wait(2000);
    cy.contains('a', 'CCBC-010001').click();
    cy.url().should('include', '/analyst/application/');
  });

  it('sort dashboard', () => {
    cy.visit('/analyst/dashboard');
    cy.wait(2000);
    cy.get('tr > th').eq(1).click();
    cy.getCookie('mrt_sorting_application').should(
      'have.property',
      'value',
      '[{%22id%22:%22intakeNumber%22%2C%22desc%22:true}]'
    );

    // add wait to prevent happo diff from taking a screenshot before the sort is complete
    cy.wait(2000);

    cy.get('body').happoScreenshot({ component: 'Sorted Analyst Dashboard' });
  });
});
