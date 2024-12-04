/* eslint-disable import/extensions */
import {
  rfiSetup,
  rfiSetupCcbcAdmin,
  rfiSetupCbcAdmin,
  rfiSetupSuperAdmin,
} from './setup.cy.js';

const setups = [
  { setup: rfiSetup, role: 'Default Analyst' },
  { setup: rfiSetupCcbcAdmin, role: 'CCBC Admin' },
  { setup: rfiSetupCbcAdmin, role: 'CBC Admin' },
  { setup: rfiSetupSuperAdmin, role: 'Super Admin' },
];

describe('The RFI index page', () => {
  setups.forEach(({ setup, role }) => {
    describe(`as ${role}`, () => {
      beforeEach(() => {
        setup();
      });

      it('loads', () => {
        cy.visit('/analyst/application/1/rfi');
        cy.contains('h2', 'RFI');
        cy.get('body').happoScreenshot({
          component: `Empty Rfi Page - ${role}`,
        });
      });

      it('Creates a new RFI', () => {
        cy.visit('/analyst/application/1/rfi');
        cy.contains('h2', 'RFI');
        cy.wait('@graphql');
        cy.contains('button', 'New RFI').click();
        cy.url().should('contain', '/analyst/application/1/rfi/0');
        cy.get('[data-testid=file-test]')
          .first()
          .selectFile('cypress/fixtures/doc.txt', { force: true });
        cy.get('input[id="root_rfiAdditionalFiles_detailedBudgetRfi"]')
          .parent()
          .click();
        cy.get('input[id="root_rfiType-0"]').parent().click();
        cy.contains('button', /^Save$/).click();
        cy.get('svg[data-icon="pen"]').should('exist');
        cy.get('body').happoScreenshot({
          component: `Saved RFI Index Page - ${role}`,
        });
        cy.get('svg[data-icon="pen"]').click();
        cy.get('[data-testid=file-test]').should('exist');
        cy.get('body').happoScreenshot({
          component: `Saved RFI Page - ${role}`,
        });
      });
    });
  });
});
