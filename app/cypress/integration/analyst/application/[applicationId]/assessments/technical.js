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

  it('Filled Technical Assessment Page', () => {
    cy.visit('/analyst/application/1/assessments/technical');
    cy.contains('a', 'Technical');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').type('2023-03-10');
    cy.get('input[id="root_nextStep-1"]').click();
    cy.get('input[id="root_decision-1"]').click();
    cy.contains('button', 'Save').click();
    cy.contains('button', 'Saved');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst Financial Risk Assessment Page',
    });
  });
});
