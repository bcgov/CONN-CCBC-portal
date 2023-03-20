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

  it('Filled permitting assessment page', () => {
    cy.visit('/analyst/application/1/assessments/permitting');
    cy.contains('a', 'Permitting');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').type('2023-03-10');
    cy.get('input[id="root_decision-0"').click();
    cy.get('input[id="root_decision-1"').click();
    cy.get('input[id="root_decision-2"').click();
    cy.get('input[id="root_notesAndConsiderations"').type(
      'These are some notes and considerations'
    );
    cy.contains('button', 'Save').click();
    cy.contains('button', 'Saved');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst permitting assessment page',
    });
  });
});
