import assessmentsSetup from './setup.js';

describe('The analyst project management assessment page', () => {
  beforeEach(() => {
    assessmentsSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/application/1/assessments/project-management');
    cy.contains('a', 'Project Management');
    cy.get('body').happoScreenshot({
      component: 'Analyst project management assessment page',
    });
  });
});
