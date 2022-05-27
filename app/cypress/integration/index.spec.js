context('Homepage', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  it('should start and fill the first page of the form', () => {
    cy.get('body').happoScreenshot();

    cy.get('h1').contains('Welcome');

    cy.get('button')
      .contains('Login')
      .click()
      .then(() => {
        cy.visit('/form/1');
        cy.get('h1').contains('Organization Profile');
      });

    cy.get('[id="root_projectTitle"]').type('test');

    cy.get('input[id="root_typeOfOrganization-0"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-1"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-2"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-3"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-4"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-5"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-6"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-7"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-8"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-9"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-10"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-11"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-12"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-13"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-14"]').parent().click();

    cy.get('[id="root_organizationName"]').type('test');

    cy.get('[id="root_isLegalPrimaryName-1"]');

    cy.get('button')
      .contains('Continue')
      .click()
      .then(() => {
        cy.get('h1').contains('Organization location');
      });

    cy.get('body').happoScreenshot();
  });

  it('should render the header', () => {
    cy.get('header').contains('Help');
    cy.get('header').get('.banner').find('img');
    cy.get('.pg-menu-group').find('a').contains('Dashboard');
    cy.get('.pg-menu-group').find('form').get('button').contains('Login');
  });

  it('should render the footer', () => {
    cy.get('footer').contains('Home');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');
  });
});
