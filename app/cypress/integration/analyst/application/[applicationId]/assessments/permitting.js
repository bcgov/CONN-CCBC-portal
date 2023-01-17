import assessmentsSetup from './setup.js';

describe('The analyst permitting assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/permitting');
    cy.contains('a', 'Permitting');
    cy.get('body').happoScreenshot({
      component: 'Analyst permitting assessment page',
    });
  });
});
