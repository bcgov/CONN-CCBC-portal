import testSetup from './setup.js';

describe('The admin Application intakes page', () => {
  beforeEach(() => {
    testSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('a', 'Application intakes');
    cy.get('body').happoScreenshot({
      component: 'The admin Application intakes page',
    });
  });
});
