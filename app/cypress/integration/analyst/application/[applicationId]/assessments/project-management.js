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

  it('Filled Project Management Page', () => {
    cy.visit('/analyst/application/1/assessments/project-management');
    cy.contains('a', 'Project Management');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').type('2023-03-10');
    cy.get('input[id="root_nextStep-1"]').click();
    cy.contains('button', 'Save').click();
    cy.contains('button', 'Saved');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst project management assessment page',
    });
  });
});
