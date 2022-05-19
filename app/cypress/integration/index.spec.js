context('Homepage', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  it('should start and fill the first page of the form', () => {
    cy.get('body').happoScreenshot();

    cy.get('button').contains('Login');

    cy.visit('/form/1');

    cy.url().should('include', '/form/1');

    cy.get('[id="root_organizationProfile_organizationName').type('test');

    cy.get('input[name="root_organizationProfile_isLegalPrimaryName-0-radio"]')
      .parent()
      .click();

    cy.get('input[name="root_organizationProfile_isLegalPrimaryName-1-radio"]')
      .parent()
      .click();

    cy.get('input[name="root_organizationProfile_isOperatingNameSame-0-radio"]')
      .parent()
      .click();

    cy.get('input[name="root_organizationProfile_isOperatingNameSame-1-radio"]')
      .parent()
      .click();

    cy.get('[id="root_organizationProfile_operatingNameIfDifferent"]').type(
      'test'
    );

    // Type of organization radio group
    cy.get('input[name="root_organizationProfile_typeOfOrganization-0-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-1-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-2-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-3-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-4-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-5-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-6-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-7-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-8-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-9-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-10-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-11-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-12-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-13-radio"]')
      .parent()
      .click();
    cy.get('input[name="root_organizationProfile_typeOfOrganization-14-radio"]')
      .parent()
      .click();

    cy.get('[id="root_organizationProfile_bandCouncilNumber"]').type(
      '0123456789'
    );

    cy.get('input[name="root_organizationProfile_isIndigenousEntity-0-radio"]')
      .parent()
      .click();

    cy.get('input[name="root_organizationProfile_isIndigenousEntity-1-radio"]')
      .parent()
      .click();

    cy.get('[id="root_organizationProfile_indigenousEntityDesc"]').type('test');

    cy.get('[id="root_organizationProfile_organizationOverview"]').type('test');

    cy.get('[id="root_organizationProfile_orgRegistrationDate"]').type(
      '2022-05-22'
    );

    cy.get('[id="root_organizationProfile_bussinessNumber"]').type(
      '0123456789'
    );

    cy.get('body').happoScreenshot();

    // cy.get('button').contains('Complete application').click();

    // cy.url().should('include', '/form/success');

    // cy.get('body').happoScreenshot();
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
