/* eslint-disable import/extensions */
import dayjs from 'dayjs';
import testSetup from './setup.cy.js';

describe('The admin Application intakes page', () => {
  beforeEach(() => {
    testSetup();
  });

  it('loads', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('a', 'Application intakes');
    cy.get('body').happoScreenshot({
      component: 'The admin Application intakes page',
    });
  });

  it('Create intake start date and end date must be provided', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.wait('@graphql');
    cy.contains('button', /Add intake/).click();
    cy.contains('button', /Save/).scrollIntoView().click();
    cy.contains('Start date & time must be entered');
    cy.contains('End date & time must be entered');
  });

  it('Create intake start date and end date must be after current date and time', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.wait('@graphql');
    cy.contains('button', /Add intake/).click();
    cy.get('input[id="root_startDate"]').type('2024-02-01 00:00 AM');
    cy.get('input[id="root_endDate"]').type('2024-01-30 00:00 AM');
    cy.contains('Start date & time must be after current date & time');
    cy.contains('End date & time must be after start date & time');
  });

  it('Create Intake', () => {
    const formattedStartDate = dayjs().add(1, 'months').format('YYYY-MM-DD');
    const formattedEndDate = dayjs().add(2, 'months').format('YYYY-MM-DD');

    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.contains('button', /Add intake/).click();
    cy.get('input[id="root_startDate"]').type(`${formattedStartDate} 00:00 AM`);
    cy.get('input[id="root_endDate"]').type(`${formattedEndDate} 00:00 AM`);
    cy.get('input[id="root_description"]').type('Test Intake');
    cy.contains('button', /^Save$/)
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.wait(500);
    cy.contains('Intake 4').should('be.visible');
  });

  it('Update intake start date must not overlap with previous intake', () => {
    const currentDateFormatted = dayjs().format('YYYY-MM-DD HH:mm A');
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.wait('@graphql');
    cy.get('[data-testid="edit-intake"]').first().click();
    cy.get('input[id="root_startDate"]').type(currentDateFormatted);
    cy.contains('Start date & time must not overlap with the previous intake');
  });

  it('Update intake end date must not overlap with next intake', () => {
    const nextMonthDateFormatted = dayjs()
      .add(1, 'months')
      .format('YYYY-MM-DD HH:mm A');
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.wait('@graphql');
    cy.get('[data-testid="edit-intake"]').eq(1).scrollIntoView().click();
    cy.get('input[id="root_endDate"]').type(nextMonthDateFormatted);
    cy.contains('End date & time must not overlap with the next intake');
  });

  it('Update Intake', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('h2', 'Application Intakes');
    cy.wait('@graphql');
    cy.get('[data-testid="edit-intake"]').first().scrollIntoView().click();
    cy.get('input[id="root_description"]').type(' Edited');
    cy.contains('button', /^Save$/).click();
    cy.contains(/Test Intake Edited/);
  });

  it('Delete Intake', () => {
    cy.visit('/analyst/admin/application-intakes');
    cy.contains('Intake 4');
    cy.contains('button', /^Delete$/).click();
    cy.contains('Intake 4').should('not.exist');
  });
});
