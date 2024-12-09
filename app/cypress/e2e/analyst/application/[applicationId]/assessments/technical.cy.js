/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

/**
 * Reusable function to test loading of the technical assessment page
 * @param {string} screenShotTitle - Title for the screenshot
 * @param {Function} setupFunction - Setup function for the specific user role
 */
const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments/technical');
  cy.contains('a', 'Technical');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst technical assessment page', () => {
  // Test loading for Analyst role
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/technical');
    cy.contains('a', 'Technical');
    cy.get('body').happoScreenshot({
      component: 'Analyst technical assessment page',
    });
  });

  // Test loading for CBC Admin role
  it('loads with CBC Admin', () => {
    testLoad(
      'Technical assessment page with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  // Test loading for Admin role
  it('loads with Admin', () => {
    testLoad(
      'Technical assessment page with Admin',
      assessmentsSetupLoginAdmin
    );
  });

  // Test loading for Super Admin role
  it('loads with Super Admin', () => {
    testLoad(
      'Technical assessment page with Super Admin',
      assessmentsSetupLoginSuperAdmin
    );
  });

  // Test for filling and saving the technical assessment form (Analyst role)
  it('fills and saves the technical assessment page', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/technical');
    cy.contains('a', 'Technical');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.get('input[id="root_nextStep-1"]').parent().click();
    cy.get('input[id="root_decision-1"]').parent().click();
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved').should('exist');
    cy.visit('/analyst/application/1/assessments/technical');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst Technical Assessment Page',
    });
  });
});
