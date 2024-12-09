/* eslint-disable import/extensions */
import assessmentsSetup, {
  assessmentsSetupLoginAdmin,
  assessmentsSetupLoginCbcAdmin,
  assessmentsSetupLoginSuperAdmin,
} from './setup.cy.js';

const testLoad = (screenShotTitle, setupFunction) => {
  setupFunction();
  cy.visit('/analyst/application/1/assessments/gis');
  cy.contains('a', 'GIS');
  cy.get('body').happoScreenshot({
    component: screenShotTitle,
  });
};

describe('The analyst GIS assessment page', () => {
  it('loads with analyst', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/gis');
    cy.contains('a', 'GIS');
    cy.get('body').happoScreenshot({
      component: 'Analyst GIS assessment page',
    });
  });

  it('loads with cbcAdmin', () => {
    testLoad(
      'Analyst GIS assessment page with CBC Admin',
      assessmentsSetupLoginCbcAdmin
    );
  });

  it('loads with admin', () => {
    testLoad(
      'Analyst GIS assessment page with admin',
      assessmentsSetupLoginAdmin
    );
  });

  it('loads with super admin', () => {
    testLoad(
      'Analyst GIS assessment page with super admin',
      assessmentsSetupLoginSuperAdmin
    );
  });

  it('Filled GIS Assessment Page and saved', () => {
    assessmentsSetup();
    cy.visit('/analyst/application/1/assessments/gis');
    cy.contains('a', 'GIS');
    cy.wait('@graphql');
    cy.get('select[id="root_assignedTo"]').select('Meherzad Romer');
    cy.get('input[id="root_targetDate"]').invoke('val', '2023-03-10');
    cy.contains('button', /^Save$/).click();
    cy.contains('button', 'Saved');
    cy.visit('/analyst/application/1/assessments/gis');
    cy.get('body').happoScreenshot({
      component: 'Filled Analyst GIS Assessment Page',
    });
  });
});
