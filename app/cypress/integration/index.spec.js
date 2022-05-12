context('Homepage', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  it('should start and fill the first page of the form', () => {
    cy.get('body').happoScreenshot();

    cy.get('button').contains('Start Form').click();
    cy.get('[id="root_organizationProfile_organizationName').type('test');

    // cy.get('input[name="Is this the primary legal name?"][type="radio"]')
    //   .first()
    //   .parent()
    //   .click();

    // cy.get('input[name="Is operating name same as legal name?"][type="radio"]')
    //   .first()
    //   .parent()
    //   .click();

    cy.get('[id="root_organizationProfile_operatingNameIfDifferent"]').type(
      'test'
    );

    // Type of organization checkbox group
    // cy.get('input[name="root_typeOfOrganization_0-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_1-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_2-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_3-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_4-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_5-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_6-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_7-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_8-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_9-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_10-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_11-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_12-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_13-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();
    // cy.get('input[name="root_typeOfOrganization_14-checkbox"][type="checkbox"]')
    //   .parent()
    //   .click();

    cy.get('[id="root_organizationProfile_bandCouncilNumber"]').type('test');

    // cy.get(
    //   'input[name="Is this applicant organization an Idigenous entity?"][type="radio"]'
    // )
    //   .first()
    //   .parent()
    //   .click();

    cy.get('[id="root_organizationProfile_indigenousEntityDesc"]').type('test');

    cy.get('[id="root_organizationProfile_organizationOverview"]').type('test');

    cy.get('[id="root_organizationProfile_bussinessNumber"]').type('test');

    cy.get('body').happoScreenshot();
  });

  it('should render the header', () => {
    cy.get('header').contains('Help');
    cy.get('header').get('.banner').find('svg');
    cy.get('h1').contains('Connecting Communities BC');
  });

  it('should render the footer', () => {
    cy.get('footer').contains('Home');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');
  });
});
