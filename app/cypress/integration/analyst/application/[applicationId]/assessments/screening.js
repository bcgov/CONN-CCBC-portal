import assessmentsSetup from './setup.js';

describe('The analyst screening assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/screening');
    cy.contains('a', 'Screening');
    cy.get('body').happoScreenshot({
      component: 'Analyst screening assessment page',
    });
  });
});
