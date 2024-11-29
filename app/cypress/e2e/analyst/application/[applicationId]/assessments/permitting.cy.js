/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

/**
 * Reusable function to test loading of the permitting assessment page
 * @param {string} screenShotTitle - Title for the screenshot
 * @param {Function} setupFunction - Setup function for the specific user role
 */
const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments/permitting');
  cy.contains('a', 'Permitting');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst permitting assessment page', () => {
  // Test loading for Analyst role
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/permitting');
    cy.contains('a', 'Permitting');
    cy.get('body').happoScreenshot({
      component: 'Analyst permitting assessment page',
    });
  });

  // Test loading for CBC Admin role
  it('loads with CBC Admin', () => {
    testLoad(
      'Permitting assessment page with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  // Test loading for Admin role
  it('loads with Admin', () => {
    testLoad(
      'Permitting assessment page with Admin',
      assessmentsSetupLoginAdmin
    );
  });

  // Test loading for Super Admin role
  it('loads with Super Admin', () => {
    testLoad(
      'Permitting assessment page with Super Admin',
      assessmentsSetupLoginSuperAdmin
    );
  });

  // Test for filling and saving the permitting assessment form (Analyst role)
  it('fills and saves the permitting assessment page', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/permitting');
    cy.contains('a', 'Permitting');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.get('input[id="root_decision-0"]').parent().click();
    cy.get('input[id="root_decision-1"]').parent().click();
    cy.get('input[id="root_decision-2"]').parent().click();

    cy.get('#root_notesAndConsiderations').type(
      'These are some notes and considerations'
    );
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved');
    cy.visit('/analyst/application/1/assessments/permitting');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst permitting assessment page',
    });
  });
});
