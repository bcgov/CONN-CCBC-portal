import assessmentsSetup from './setup.js';

describe('The analyst assessments dashboard view', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments');
    cy.contains('h2', 'Assessments');
    cy.get('body').happoScreenshot({
      component: 'Analyst assessments dashboard',
    });
  });
});
