import assessmentsSetup from './setup.js';

describe('The analyst financial risk assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/financial-risk');
    cy.contains('a', 'Financial Risk');
    cy.get('body').happoScreenshot({
      component: 'Analyst financial risk assessment page',
    });
  });
});
