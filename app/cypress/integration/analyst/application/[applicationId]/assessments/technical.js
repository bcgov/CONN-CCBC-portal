import assessmentsSetup from './setup.js';

describe('The analyst technical assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/technical');
    cy.contains('a', 'Technical');
    cy.get('body').happoScreenshot({
      component: 'Analyst technical assessment page',
    });
  });
});
